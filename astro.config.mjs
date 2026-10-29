import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const section = (label, items) => ({
  label,
  items: items.map(([label, slug]) => ({ label, slug: `docs/${slug}` })),
});

export default defineConfig({
  // Set SITE_URL to the final HTTPS origin when preparing a deployment.
  site: process.env.SITE_URL,
  output: 'static',
  server: { host: process.env.HOST ?? '127.0.0.1', allowedHosts: ['darb-docs.localhost'] },
  integrations: [starlight({
    title: 'Darb',
    disable404Route: true,
    description: 'Finish the YouTube courses you save. Install Darb, build a learning path, and connect your AI when you need it.',
    logo: { src: './src/assets/logo.svg', alt: '', replacesTitle: false },
    favicon: '/favicon.svg',
    customCss: ['./src/styles/custom.css'],
    social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/KhalidRouissi1/darb-youtube' }],
    editLink: { baseUrl: 'https://github.com/KhalidRouissi1/darb-docs/edit/main/' },
    components: { Header: './src/components/Header.astro', PageTitle: './src/components/PageTitle.astro', Footer: './src/components/Footer.astro' },
    sidebar: [
      section('Start here', [['Introduction', 'introduction'], ['Install Darb', 'install'], ['Your first course', 'first-course']]),
      section('Learn with Darb', [['Sessions & resume', 'sessions'], ['Playlists', 'playlists'], ['Notes & timestamps', 'notes']]),
      section('Your workspace', [['Dashboard', 'dashboard'], ['Folders & tags', 'folders'], ['Graph', 'graph']]),
      section('Connect your AI', [['How it works', 'ai'], ['Codex', 'ai/codex'], ['Claude Code', 'ai/claude'], ['Example prompts', 'ai/prompts'], ['Tools & permissions', 'ai/tools'], ['Live vs snapshot', 'ai/modes'], ['Disconnect & revoke', 'ai/revoke']]),
      section('Help', [['Video tutorials', 'tutorials'], ['Troubleshooting', 'troubleshooting'], ['FAQ', 'faq'], ['Privacy', 'privacy']]),
      section('Open source', [['Contribute', 'contributing'], ['Build locally', 'development'], ['Releases', 'releases']]),
    ],
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
  })],
});
