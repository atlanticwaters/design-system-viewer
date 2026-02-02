# Design System Viewer

A visual design token browser and editor with GitHub integration and Figma plugin support.

## Features

- **Token Viewer** - Browse and visualize design tokens across colors, typography, spacing, and more
- **Token Editor** - Edit tokens with validation, then commit changes to GitHub
- **Figma Plugin** - Lint Roller plugin for design linting and token suggestions

## Quick Start

### Development Server

```bash
npm install
npm run dev
```

Opens at http://localhost:5173/design-system-viewer/

### Navigation

| Tab | Description |
|-----|-------------|
| Overview | Summary of all token categories |
| Editor | Edit tokens with GitHub commit support |
| Semantic | Light/dark theme semantic tokens |
| Pairings | Foreground/background color pairings |
| Colors | Core and semantic color palettes |
| Typography | Font families, sizes, weights |
| Spacing | Spacing scale tokens |
| Components | Component-specific tokens |

## Token Editor

The Editor tab provides a complete token editing workflow:

1. **Browse & Search** - Filter tokens by layer (core/semantic/component) and type
2. **Edit** - Modify token values with type-aware inputs (color picker, etc.)
3. **Validate** - Real-time DTCG schema validation
4. **Commit** - Push changes to GitHub (direct commit or PR)

### GitHub Authentication

Click **Sign in** to authenticate with a GitHub Personal Access Token (PAT):
- Requires `repo` scope for write access
- Token is stored in localStorage

## Lint Roller Figma Plugin

A Figma plugin for linting designs against your design tokens.

### Installation

1. Open **Figma Desktop**
2. Go to **Plugins** → **Development** → **Import plugin from manifest**
3. Select: `_plugin/LintRoller/_Figma Plugin/Lint Roller/manifest.json`

### Features

- **Scan** - Find hardcoded colors, typography, spacing, and radii
- **Suggestions** - Get token suggestions using Delta E color matching
- **Auto-fix** - Apply token bindings with one click
- **Sync** - Sync tokens to Figma variables

### Lint Rules

| Rule | Description |
|------|-------------|
| `no-hardcoded-colors` | Flags hex colors not using variables |
| `no-hardcoded-typography` | Flags unbound font properties |
| `no-hardcoded-spacing` | Flags hardcoded dimension values |
| `no-hardcoded-radii` | Flags hardcoded corner radius |
| `no-orphaned-variables` | Flags variables with no matching token |
| `no-unknown-styles` | Flags unrecognized styles |

## Token Source

Tokens are loaded from:
- **Local**: `/public/tokens/` directory (default)
- **GitHub**: [atlanticwaters/Tokens-Studio-Sandbox](https://github.com/atlanticwaters/Tokens-Studio-Sandbox)

## Project Structure

```
design-system-viewer/
├── src/
│   ├── editor/              # Token editor components
│   │   ├── components/      # Editor UI (EditorPanel, TokenForm, etc.)
│   │   ├── hooks/           # useTokenEditor, usePendingChanges, useGitHubAuth
│   │   └── utils/           # Validation, serialization
│   └── tokens-studio/       # Token viewer components
│       ├── components/      # Display components for each token type
│       ├── hooks/           # useTokensStudio
│       └── utils/           # Token parsing, resolution, GitHub API
├── tokens/                  # Local token files (DTCG format)
├── public/tokens/           # Served token files for dev
└── _plugin/
    └── LintRoller/          # Figma plugin source
        ├── src/
        │   ├── plugin/      # Figma sandbox code
        │   ├── ui/          # Plugin UI (Preact)
        │   └── shared/      # Shared utilities
        └── _Figma Plugin/   # Built plugin for installation
```

## Development

### Build the Figma Plugin

```bash
cd _plugin/LintRoller
npm install
npm run build
```

### Run Tests

```bash
cd _plugin/LintRoller
npm test
```

## License

MIT
