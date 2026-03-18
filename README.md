# TabSlim

TabSlim (aka SlimTab) — a lightweight, fast tab manager designed to help you organise, search, and restore browser tabs with minimal overhead.

Badges
- Build: ![build-badge](https://img.shields.io/badge/build-pending-lightgrey)
- License: ![license-badge](https://img.shields.io/badge/license-MIT-blue)

Table of Contents
- [About](#about)
- [Key Features](#key-features)
- [Install (User)](#install-user)
- [Install (Developer / From Source)](#install-developer--from-source)
- [Usage](#usage)
- [Configuration](#configuration)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

## About

TabSlim is focused on keeping your browser sessions lean and recoverable: save and restore tab groups, search open and saved tabs, suspend unused tabs to save memory, and navigate quickly with keyboard shortcuts. It's intentionally minimalistic and designed to be fast and unobtrusive.

## Key Features

- Save and restore tab groups (sessions)
- Quick search across open and saved tabs
- Lightweight UI with keyboard-first workflows
- Optional tab suspension to reduce memory usage
- Import/export sessions (JSON)
- Compact, accessible popup UX with keyboard navigation
- Configurable autosave interval and retention

## Install (User)

Option A — Chrome / Edge (unpacked for testing)
1. Download or clone this repository.
2. Build the extension (see "Install (Developer)").
3. Open chrome://extensions (or edge://extensions).
4. Enable "Developer mode".
5. Click "Load unpacked" and select the `dist/` (or `build/`) folder.

Option B — Firefox (temporary add-on)
1. Build the extension (see "Install (Developer)").
2. Open about:debugging#/runtime/this-firefox.
3. Click "Load Temporary Add-on" and choose the `manifest.json` inside the build folder.

Option C — Production
- Publish to Chrome Web Store / Mozilla Add-ons following each store's submission process. Provide screenshots, description, and privacy information as required.

## Install (Developer / From Source)

Prerequisites:
- Node.js (16+ recommended)
- npm or yarn
- Git

Clone and install:
```bash
git clone https://github.com/20jenselucjj/SlimTab.git
cd SlimTab
npm install
# or
yarn
```

Build:
```bash
npm run build
# or
yarn build
```

Run dev watch (hot reload where supported):
```bash
npm run dev
# or
yarn dev
```

Lint and format:
```bash
npm run lint
npm run format
```

Run tests:
```bash
npm test
```

Notes:
- Adjust build output path in `package.json` or build config if different browsers require specific packaging.
- If using TypeScript, ensure `tsconfig.json` is configured for the extension manifest and bundler.

## Usage

Opening the UI:
- Click the extension icon to open the popup.
- Use the search input to find open or saved tabs (fuzzy search supported).
- Use Save Session to snapshot all current windows/tabs.
- Use Restore Session to re-open tabs from a saved snapshot.

Command palette (if implemented):
- Press the configured shortcut to open command/search palette.
- Type actions like `save`, `restore`, `suspend <tab>`, or filter by domain.

Export / Import sessions:
- Export session: Settings → Export → Save JSON file.
- Import session: Settings → Import → Choose a previously exported JSON file.

Example JSON session (simplified):
```json
{
  "name": "Sprint Research",
  "created_at": "2026-03-18T12:00:00Z",
  "tabs": [
    {"title": "Docs", "url": "https://example.com/docs"},
    {"title": "Article", "url": "https://news.example/article"}
  ]
}
```

## Configuration

Settings available in the Options page:
- Autosave interval (minutes)
- Max saved sessions
- Tab suspension timeout (minutes)
- Preserve pinned tabs (on/off)
- Keyboard shortcuts (customize via browser extension shortcuts page)
- Auto-restore behavior on startup (prompt / restore latest / do nothing)

## Keyboard Shortcuts

(Default suggestions — can be changed in browser UI)
- Open popup: Alt+Shift+S
- Open command/search palette: Ctrl+Shift+P
- Save current session: Ctrl+Shift+S
- Restore last session: Ctrl+Shift+R
- Suspend current tab: Ctrl+Shift+D

(Configure via browser extension settings or in the Options page where supported.)

## Troubleshooting

- Extension doesn't appear after loading unpacked:
  - Ensure the build folder contains manifest.json at top level.
  - Check console (Extensions page) for manifest errors.

- Tabs won't restore:
  - Verify the saved session JSON contains valid URLs.
  - Some sites may block being opened by extensions — open manually if necessary.

- Suspension not working:
  - Browser vendors may restrict programmatic tab discarding; the extension will attempt the supported API and fall back gracefully.

## Development

Project structure (example):
- src/
  - background.ts — background/service worker logic
  - popup/ — popup UI (React / Svelte / plain JS)
  - options/ — options page
  - content-scripts/ — any content scripts
- public/ — static assets
- dist/ or build/ — bundled extension output
- manifest.json

Recommended workflow:
1. Implement feature in `src/`.
2. Add/update tests.
3. Run `npm run build` and load unpacked for manual testing.
4. Open extension console and fix issues.

Testing:
- Unit tests: Jest or Vitest
- E2E: Playwright for extension pages where applicable
- Linting: ESLint
- Formatting: Prettier

## Contributing

Thanks for considering contributing! Typical workflow:
1. Fork the repo.
2. Create a branch: `git checkout -b feat/short-description`
3. Make changes and include tests.
4. Run linters and tests: `npm run lint && npm test`
5. Create a PR with a clear description and screenshots if UI changes.

Please follow the established code style and include tests for new logic. For large features, open an issue first to discuss design.

Code of Conduct: Be respectful and welcoming. See `CODE_OF_CONDUCT.md` (add this file to your repo).

## Roadmap

Planned improvements:
- Sync sessions across devices (using optional cloud sync)
- Group-by-domain smart suggestions
- Integrate with browser history for richer session snapshots
- Theme / accessibility improvements

If you'd like to prioritize features, open an issue or vote on existing ones.

## License

This project is licensed under the MIT License — see the LICENSE file for details.

## Contact

Author: 20jenselucjj  
Repo: https://github.com/20jenselucjj/SlimTab

Acknowledgements
- Thanks to the open-source community and any libraries used (list them in `NOTICE` or `ACKNOWLEDGEMENTS` as needed).
