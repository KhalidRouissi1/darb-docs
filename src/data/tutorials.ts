export interface Tutorial {
  id: string;
  title: string;
  summary: string;
  guide: string;
  targetDuration: string;
  videoId?: string;
  duration?: string;
  testedVersion?: string;
  chapters?: { title: string; seconds: number }[];
}

// Add a verified YouTube ID, actual duration and chapters when each recording is ready.
// Missing videos intentionally render a useful guide link, never an empty iframe.
export const tutorials: Tutorial[] = [
  { id: 'overview', title: 'Meet Darb', summary: 'From a saved video to a study session you can finish.', guide: '/docs/introduction/', targetDuration: '45–90 seconds' },
  { id: 'install', title: 'Install Darb', summary: 'Install, pin the extension and open your dashboard.', guide: '/docs/install/', targetDuration: '2–3 minutes' },
  { id: 'first-course', title: 'Your first course', summary: 'Choose your study time, start a session and resume later.', guide: '/docs/first-course/', targetDuration: '2–3 minutes' },
  { id: 'playlists', title: 'Build a learning playlist', summary: 'Select videos, save a path and move to the next lesson.', guide: '/docs/playlists/', targetDuration: '2–3 minutes' },
  { id: 'notes', title: 'Notes and organization', summary: 'Save a moment, jump back to it and organize your library.', guide: '/docs/notes/', targetDuration: '2–3 minutes' },
  { id: 'codex', title: 'Connect Codex', summary: 'Share selected courses and make your first real tool call.', guide: '/docs/ai/codex/', targetDuration: '3–5 minutes' },
  { id: 'claude', title: 'Connect Claude Code', summary: 'Connect your learning library to Claude Code.', guide: '/docs/ai/claude/', targetDuration: '3–5 minutes' },
];
