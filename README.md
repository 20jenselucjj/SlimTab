# SlimTab

A lightweight, privacy-focused browser extension for Chrome that gives you control over your browsing experience. Tab suspension, ad blocking, script control, and page-speed optimization — all in one extension.

![SlimTab](public/Logo.png)

## Badges

- Build: ![build-badge](https://img.shields.io/badge/build-pending-lightgrey)
- License: ![license-badge](https://img.shields.io/badge/license-MIT-blue)

## Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Installation](#installation)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tech Stack](#tech-stack)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## About

SlimTab is focused on keeping your browser sessions lean and performant. Save and restore tab groups, control ads and scripts, suspend unused tabs to save memory, and navigate quickly with keyboard shortcuts.

## Key Features

- **Tab Suspension**: Automatically suspend inactive tabs to free up memory and CPU. Your tabs are preserved and restored instantly.
- **Ad Blocking**: Three levels of blocking (Low, Medium, High) to match your browsing style
- **Script Control**: Control which scripts run on websites — from essential-only to full blocking
- **Performance Dashboard**: Track memory saved, active tabs, scripts controlled, and pages optimized
- **Privacy Controls**: Block trackers and analytics, manage site permissions
- **Session Management**: Save and restore tab groups (sessions)
- **Quick Search**: Find open and saved tabs with fuzzy search
- **Import/Export**: Export sessions to JSON for backup or sharing

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/20jenselucjj/SlimTab.git
cd SlimTab

# Install dependencies
pnpm install

# Build the extension
pnpm build
```

### Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top right)
3. Click **Load unpacked**
4. Select the `.output/chrome-mv3-dev` directory

### Loading in Firefox (temporary)

1. Build the extension (`pnpm build`)
2. Open `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on" and choose the manifest in the build folder

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+Shift+S` | Suspend inactive tabs in current window |
| `Alt+Shift+D` | Open SlimTab options/dashboard |

## Tech Stack

- **[WXT](https://wxt.dev)** — Modern browser extension framework
- **React 19** — UI library
- **TailwindCSS** — Utility-first styling
- **Zustand** — State management
- **TypeScript** — Type safety

## Project Structure

```
SlimTab/
├── entrypoints/          # Extension entry points
│   ├── options/          # Options page
│   └── popup/            # Popup UI
├── src/
│   ├── app/              # Main app shell
│   ├── background/       # Background scripts
│   ├── components/       # Shared UI components
│   ├── content/          # Content scripts
│   ├── options/          # Options page components
│   ├── popup/            # Popup components
│   ├── shared/           # Shared utilities
│   ├── storage/          # Storage utilities
│   ├── store/            # Zustand stores
│   └── styles/           # Global styles
├── public/                # Static assets
├── scripts/               # Build scripts
├── wxt.config.ts         # WXT configuration
└── tailwind.config.ts    # Tailwind configuration
```

## Development

```bash
# Start development server with hot reload
pnpm dev

# Type check
pnpm check

# Run tests
pnpm test

# Build for production
pnpm build

# Package for distribution
pnpm zip
```

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

1. Fork the repo
2. Create a branch: `git checkout -b feat/short-description`
3. Make changes and include tests
4. Create a PR with a clear description

## License

This project is licensed under the MIT License — see the LICENSE file for details.

## Contact

Author: 20jenselucjj  
Repo: https://github.com/20jenselucjj/SlimTab

---

Made with 🔋 for a faster, lighter browsing experience.
