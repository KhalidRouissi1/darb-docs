import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';

// Load the real browser search bundle with local asset reads, without a web server.
const assets = resolve(fileURLToPath(new URL('../dist/pagefind/', import.meta.url)));
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input) => {
  const url = new URL(typeof input === 'string' ? input : input.url ?? input.href);
  assert.equal(url.protocol, 'file:', 'Search verification must stay local');
  const path = resolve(fileURLToPath(url));
  assert.ok(path.startsWith(assets + sep), 'Search asset outside generated index');
  const data = await readFile(path);
  return new Response(data, { headers: { 'Content-Type': path.endsWith('.json') ? 'application/json' : 'application/octet-stream' } });
};
try {
  const search = await import('../dist/pagefind/pagefind.js');
  await search.options({ baseUrl: '/' });
  for (const [query, expected] of [['install', '/docs/install/'], ['notes', '/docs/notes/'], ['Codex', '/docs/ai/codex/'], ['playlist', '/docs/playlists/'], ['connected', '/docs/troubleshooting/']]) {
    const response = await search.search(query);
    const results = await Promise.all(response.results.map(result => result.data()));
    assert.ok(results.some(result => result.url === expected), `Search '${query}' did not find ${expected}`);
  }
  await search.destroy();
  console.log('Five real Pagefind queries returned the expected guides.');
} finally {
  globalThis.fetch = originalFetch;
}
