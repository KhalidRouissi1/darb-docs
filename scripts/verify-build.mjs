import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
async function walk(path) {
  const entries = await readdir(path, { withFileTypes: true });
  return (await Promise.all(entries.map((e) => e.isDirectory() ? walk(join(path, e.name)) : [join(path, e.name)]))).flat();
}
const files = await walk(dist);
const pages = new Map();
for (const path of files.filter((p) => p.endsWith('.html'))) {
  const { document } = parseHTML(await readFile(path, 'utf8'));
  pages.set(path, document);
  assert.equal(document.querySelectorAll('h1').length, 1, `${path}: expected one h1`);
  assert.ok(document.querySelector('title')?.textContent?.trim(), `${path}: missing title`);
  assert.ok(document.querySelector('meta[name="description"]')?.getAttribute('content'), `${path}: missing description`);
  assert.ok(document.querySelector('html')?.getAttribute('lang'), `${path}: missing language`);
  for (const img of document.querySelectorAll('img')) assert.ok(img.hasAttribute('alt'), `${path}: missing image alternative`);
  assert.equal(document.querySelectorAll('iframe').length, 0, `${path}: tutorials must not load third-party videos automatically`);
}
for (const [path, document] of pages) {
  const route = path.endsWith('/index.html') ? path.slice(dist.length, -10) : path.slice(dist.length);
  for (const element of document.querySelectorAll('a[href], img[src], script[src], link[rel="stylesheet"][href]')) {
    const raw = element.getAttribute('href') ?? element.getAttribute('src');
    if (!raw || /^(https?:|mailto:|data:|tel:)/i.test(raw)) continue;
    const url = new URL(raw, `https://local.invalid${route}`);
    let target = resolve(dist, '.' + decodeURIComponent(url.pathname));
    assert.ok(target === dist || target.startsWith(dist + '/'), `Link outside site: ${raw}`);
    if (!extname(target)) target = join(target, 'index.html');
    assert.ok((await stat(target).catch(() => null))?.isFile(), `${path}: broken local link ${raw}`);
    if (url.hash && pages.has(target)) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert.ok(pages.get(target).getElementById(id), `${path}: missing anchor ${raw}`);
    }
  }
}
const home = pages.get(join(dist, 'index.html'));
assert.ok(home.body.textContent.includes('Less watch later.'));
assert.ok(home.querySelector('a[href="/docs/install/"]'));
assert.equal(pages.get(join(dist, '404.html')).querySelector('h1').textContent, "This path doesn't lead anywhere");
for (const slug of ['install', 'first-course', 'notes', 'playlists', 'ai/codex', 'ai/claude', 'privacy', 'tutorials']) {
  assert.ok(pages.has(join(dist, 'docs', slug, 'index.html')), `Missing guide ${slug}`);
}
const policy = await readFile(resolve(root, 'policies/extension-privacy.md'), 'utf8');
const generated = await readFile(join(root, 'src/content/docs/docs/privacy.md'), 'utf8');
assert.ok(generated.includes(policy.replace(/^# Darb Privacy Policy\s*/, '')), 'Privacy policy drifted');
assert.ok(files.some(p => p.endsWith('/pagefind/pagefind.js')), 'Search index missing');
if (process.env.SITE_URL) assert.ok(files.some(p => p.endsWith('/sitemap-index.xml')), 'Sitemap missing');

// Exercise the generated Pagefind browser runtime against its built index.
const { execFile } = await import('node:child_process');
const { promisify } = await import('node:util');
const run = promisify(execFile);
const { stdout } = await run(process.execPath, [join(root, 'scripts/verify-search.mjs')], { cwd: root });
process.stdout.write(stdout);
console.log(`Verified ${pages.size} pages: internal links and anchors, metadata, tutorial privacy, policy and static assets.`);
