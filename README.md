# Darb · Website & documentation

The public website and learning guides for [Darb](https://github.com/KhalidRouissi1/darb-youtube).
Built with Astro + Starlight; ready for Cloudflare Workers Static Assets.

## Develop locally

Requires Node.js **22.23.4+**; Node.js **24 LTS** is recommended.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro. For a production preview:

```sh
npm run build
npm run preview
```

## Validate

```sh
npm run verify
npm run check:cloudflare
```

Checks cover TypeScript, the static build, internal links/anchors, page metadata,
privacy synchronization, tutorial fallbacks and five real search queries.
Cloudflare validation uses `--dry-run` and uploads nothing. GitHub Actions runs
these checks; it does not deploy automatically.

## Deploy through Cloudflare

1. Open Cloudflare → **Workers & Pages** and create a Worker connected to GitHub.
2. Select **KhalidRouissi1/darb-docs**, branch **main**.
3. Keep the root directory at the repository root.
4. Set the build command to **`npm ci && npm run verify`**.
5. Set the deploy command to **`npx wrangler deploy`**.
6. Use Node.js **24** for the build environment (`NODE_VERSION=24` if necessary).
7. Once Cloudflare shows the real HTTPS hostname, set **`SITE_URL`** to that
   origin (or your connected custom domain) and rebuild. This generates the
   sitemap and canonical URLs. Do not use a guessed URL.
8. Check installation links, search, a deep documentation link and a nonexistent
   page (which should return HTTP 404).

`wrangler.jsonc` points to `dist` and serves the custom 404 page. The site needs
no runtime API, account database or application secrets. Cloudflare manages
GitHub access and deployment credentials through its own connection flow.

You can also deploy from an authenticated terminal after reviewing the build:

```sh
SITE_URL=https://YOUR-ACTUAL-HOSTNAME npm run verify
npx wrangler deploy
```

## Add your videos

Edit **`src/data/tutorials.ts`**. Add each recording's `videoId` (11 characters),
actual `duration`, `testedVersion` and optional `chapters` with times in seconds.

Until a video is added, its section shows the written guide. Videos load only
when clicked; include captions on YouTube and keep written instructions complete.

Suggested recordings: overview, installation, first course, playlists,
notes/organization, Codex setup and Claude Code setup.

## Edit documentation

Public guides: `src/content/docs/docs/`.
Navigation and theme: `astro.config.mjs` and `src/styles/custom.css`.

The extension's privacy policy is vendored at `policies/extension-privacy.md`
from the [extension repository](https://github.com/KhalidRouissi1/darb-youtube/blob/main/docs/privacy.md).
Update it when extension behavior changes. The prebuild/predev/precheck scripts
regenerate the ignored website policy page and add website-specific disclosures.
No checkout of the extension repository is needed to build this site.

## Before public launch

- Verify public extension/store/npm versions and update the release notices.
- Publish the matching extension/companion versions before advertising new features.
- Add the actual tutorial recordings and checked screenshots.
- Set the final `SITE_URL` and verify the deployed site.

The website does not host the MCP server. The companion connects locally to the
browser profile users explicitly pair and share.

## License

[MIT](LICENSE).
