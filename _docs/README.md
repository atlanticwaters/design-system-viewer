# Design Token Authoring & Management System

A purpose-built design token authoring toolkit for creating, editing, and validating DTCG-compliant design tokens. This system provides visual tooling that integrates seamlessly with the OCM token pipeline for platform-specific code generation.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platforms](https://img.shields.io/badge/platforms-iOS%20%7C%20Android%20%7C%20Web-lightgrey)

---

## Table of Contents

- [Overview](#overview)
- [System Components](#system-components)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Design System Viewer](#design-system-viewer)
- [Token Editor](#token-editor)
- [Lint Roller](#lint-roller)
- [OCM Integration](#ocm-integration)
- [Token Structure](#token-structure)
- [Workflows](#workflows)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Overview

This toolkit provides the **authoring and validation layer** for design tokens, working upstream of the OCM pipeline:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DESIGN TOKEN AUTHORING                               │
│                         (This Project's Scope)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │  Design System   │    │   Token Editor   │    │   Lint Roller    │      │
│  │  Viewer          │    │   (Planned)      │    │   (Figma)        │      │
│  │                  │    │                  │    │                  │      │
│  │  • View tokens   │    │  • Edit tokens   │    │  • Lint designs  │      │
│  │  • Browse        │    │  • GitHub sync   │    │  • Auto-fix      │      │
│  │  • Compare       │    │  • Validate      │    │  • Suggestions   │      │
│  └────────┬─────────┘    └────────┬─────────┘    └──────────────────┘      │
│           │                       │                                         │
│           │                       ▼                                         │
│           │              ┌──────────────────┐                               │
│           └─────────────▶│     GitHub       │                               │
│                          │  (Token Source)  │                               │
│                          └────────┬─────────┘                               │
│                                   │                                         │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │
                                    │ DTCG JSON (our output)
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                           OCM PIPELINE                                     │
│                      (External System - Not Modified)                      │
│                                                                            │
│  • tokens-v2 validation       • Code Connect validation                    │
│  • Style Dictionary builds    • Platform parity checks                     │
│  • Wrapper generation         • iOS/Android/Web outputs                    │
└───────────────────────────────────────────────────────────────────────────┘
```

### Why We Built This

We replaced Tokens Studio with custom authoring tools because:

- **Simpler workflow** — Our DTCG JSON in GitHub is the source of truth; we needed tools that embrace this
- **Better Figma integration** — Lint Roller provides design linting with smart token suggestions
- **Visual token management** — Design System Viewer shows tokens in context
- **OCM compatibility** — Our tools output DTCG JSON that the OCM pipeline consumes directly
- **Zero subscription cost** — Hosted on GitHub Pages, built with open source tools

### Key Principles

1. **Git is the source of truth** — Tokens are JSON files in a GitHub repository
2. **DTCG compliance** — All tokens follow the Design Tokens Community Group specification
3. **OCM compatibility** — Our output integrates seamlessly with the existing OCM pipeline
4. **Platform parity** — Tokens support iOS, Android, and Web through OCM

---

## System Components

### Our Scope (This Project)

| Component | Purpose | Status |
|-----------|---------|--------|
| **Design System Viewer** | Visual token browser and component reference | ✅ Complete |
| **Token Editor** | CRUD operations with GitHub integration | 🚧 Planned |
| **Lint Roller** | Figma plugin for design linting and auto-fix | ✅ Complete |

### OCM Pipeline (External)

| Component | Purpose | Owner |
|-----------|---------|-------|
| **tokens-v2** | Token validation and wrapper generation | OCM Team |
| **Style Dictionary** | Platform-specific code generation | OCM Team |
| **Code Connect** | Figma-to-code component linking | OCM Team |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- GitHub account with repository access
- Figma desktop app (for Lint Roller plugin)

### Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/aspect-build/aspect-design-system.git
cd aspect-design-system
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Start the Design System Viewer

```bash
cd design-system-viewer
npm run dev
```

Opens at `http://localhost:5173`

#### 4. Install Lint Roller (Figma Plugin)

1. Open Figma Desktop
2. Go to **Plugins** → **Development** → **Import plugin from manifest**
3. Select `_Figma Plugin/Lint Roller/manifest.json`

---

## Architecture

### Our Tools

```
aspect-design-system/
├── tokens/                        # DTCG token source files
│   ├── primitives/                # Core layer (raw values)
│   ├── semantic/                  # Semantic layer (themed aliases)
│   └── component/                 # Component layer (component-specific)
│
├── design-system-viewer/          # Visual component reference ✅
│   ├── src/
│   │   └── App.tsx
│   ├── dist/                      # GitHub Pages deployment
│   └── package.json
│
├── editor/                        # Token Editor 🚧 (planned)
│   └── (extends design-system-viewer)
│
└── _Figma Plugin/
    └── Lint Roller/               # Figma linting plugin ✅
        ├── src/
        │   ├── plugin/            # Plugin sandbox code
        │   │   ├── main.ts
        │   │   ├── linter.ts
        │   │   ├── fixer.ts
        │   │   └── rules/         # Lint rule implementations
        │   ├── ui/                # Preact UI
        │   └── shared/            # Shared utilities
        └── manifest.json
```

### Token Structure (DTCG)

We author tokens in DTCG format, which the OCM pipeline consumes:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CORE TOKENS                                    │
│                          (Primitives/Options)                               │
│                                                                             │
│  system.color.brand.300 = "#f96302"                                         │
│  system.dimension.16 = "16px"                                               │
│  system.fontWeight.semibold = 600                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ References via {path}
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SEMANTIC TOKENS                                  │
│                          (Decisions/Aliases)                                │
│                                                                             │
│  color.text.primary = "{system.color.greige.900}"                           │
│  color.action.primary = "{system.color.brand.300}"                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ References via {path}
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           COMPONENT TOKENS                                  │
│                         (Component-Specific)                                │
│                                                                             │
│  button.background.primary = "{color.action.primary}"                       │
│  button.text.primary = "{color.text.inverse}"                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Design System Viewer

A React-based visual reference for the design system, showing how tokens render across iOS and Android.

### Accessing the Viewer

**Production:** `https://aspect-build.github.io/design-system-viewer/`

**Development:**
```bash
cd design-system-viewer
npm run dev
```
Opens at `http://localhost:5173`

### Features

- **Platform comparison** — iOS 18 and Android 15 side-by-side
- **Theme switching** — Light and Dark mode toggle
- **Token categories** — Colors, Typography, Spacing, Components
- **Tokens Studio view** — Dedicated token browser mode
- **Component gallery** — Buttons, Inputs, Cards, Lists, Navigation, Toggles, Alerts

### Navigation

| Section | Description |
|---------|-------------|
| **Color Palette** | Core and semantic color swatches |
| **Surfaces** | Background and surface tokens |
| **Fills** | Fill color tokens |
| **Pairings** | Foreground/background combinations with contrast |
| **Outlines** | Border and outline tokens |
| **States** | Interactive state colors |
| **Typography** | Font scales and text styles |
| **Components** | Rendered component examples |

---

## Token Editor

**Status:** 🚧 Planned

The Token Editor will extend the Design System Viewer with editing capabilities:

### Planned Features

- **Visual editing** — Edit tokens with type-aware inputs (color pickers, number fields)
- **Reference resolution** — See what `{color.brand.300}` resolves to
- **Real-time validation** — DTCG schema compliance before save
- **GitHub integration** — Commit changes directly or create pull requests
- **Dark mode preview** — Test tokens in light and dark contexts

### OCM Compatibility

The Token Editor will output DTCG-compliant JSON that:
- Follows the three-tier architecture (Core → Semantic → Component)
- Uses `{path}` reference syntax
- Includes required `$value` and `$type` properties
- Validates against the same rules OCM uses

---

## Lint Roller

A Figma plugin that lints design token usage against your DTCG token exports and provides intelligent suggestions for fixes.

### Installation

1. Open Figma Desktop
2. **Plugins** → **Development** → **Import plugin from manifest**
3. Select `_Figma Plugin/Lint Roller/manifest.json`

### Lint Rules

| Rule ID | Severity | Description |
|---------|----------|-------------|
| `no-hardcoded-colors` | Error | Flags fills/strokes using literal colors instead of variables |
| `no-hardcoded-typography` | Warning | Flags unbound font properties |
| `no-hardcoded-spacing` | Warning | Flags hardcoded dimension values |
| `no-hardcoded-radii` | Warning | Flags hardcoded corner radius values |
| `no-orphaned-variables` | Error | Flags bindings to deleted/renamed variables |
| `no-unknown-styles` | Warning | Flags usage of unrecognized styles |

### Smart Token Matching

Lint Roller uses the **Delta E (CIE2000)** color distance algorithm for perceptually accurate color suggestions:

```
Target Color: #FF5733
┌────────────────────────────────────────────────┐
│ Suggested Tokens                               │
├────────────────────────────────────────────────┤
│ ✓ Exact    color.brand.300     #FF5733        │
│ ~ Close    color.accent.400    #FF6B4A  ΔE=3  │
│ ≈ Approx   color.error.500     #E53935  ΔE=12 │
└────────────────────────────────────────────────┘
```

### Auto-Fix Capabilities

| Action | Description |
|--------|-------------|
| **Fix** | Bind hardcoded value to suggested token |
| **Bulk Fix** | Fix all issues in a group or document |
| **Rebind** | Replace orphaned variable with valid token |
| **Detach** | Remove unknown style while preserving appearance |

### Token Source Configuration

Lint Roller fetches tokens from GitHub Pages. Configure in `src/plugin/tokens-data.ts`:

```typescript
const BASE_URL = 'https://aspect-build.github.io/design-tokens';

// Expected structure:
// /tokens/$metadata.json
// /tokens/$themes.json
// /tokens/<SetName>.json
```

### Workflow

```
1. Plugin Loads    → Fetches token files from GitHub Pages
2. User Scans      → Analyzes selection, page, or full document
3. Results Display → Violations grouped with suggested replacements
4. Apply Fixes     → Use Fix, Rebind, or Detach buttons
5. Re-scan         → Automatic re-scan after bulk operations
```

---

## OCM Integration

Our tools are designed to be **good partners** with the OCM pipeline. Here's how we ensure compatibility:

### What We Provide to OCM

| Output | Format | Location |
|--------|--------|----------|
| Token definitions | DTCG JSON | `tokens/` directory |
| Token metadata | `$metadata.json` | `tokens/$metadata.json` |
| Theme configuration | `$themes.json` | `tokens/$themes.json` |

### DTCG Compliance

All tokens we author follow the DTCG specification:

```json
{
  "button": {
    "background": {
      "primary": {
        "$value": "{color.action.primary}",
        "$type": "color",
        "$description": "Primary button background"
      }
    }
  }
}
```

### Layer Rules We Follow

To ensure OCM validation passes, we follow these rules:

| Layer | Can Reference | Hardcoded Values |
|-------|---------------|------------------|
| Core (primitives/) | Nothing | ✅ Allowed |
| Semantic (semantic/) | Core only | ❌ Not allowed |
| Component (component/) | Semantic preferred, Core allowlisted | ❌ Not allowed |

### Validation Before Commit

Before committing token changes, we validate locally to catch issues before OCM:

```bash
# If you have access to OCM tooling locally
npm run tokens-v2:validate

# Or use our built-in editor validation (planned)
```

### What OCM Does With Our Tokens

The OCM pipeline (managed separately) processes our DTCG JSON to:

1. **Validate** — Enforces layer rules, reference resolution, DTCG compliance
2. **Transform** — Converts tokens to platform-specific code via Style Dictionary
3. **Generate** — Creates wrapper APIs (`DS*Tokens.swift`, `DS*Tokens.kt`)
4. **Validate Code Connect** — Ensures Figma components link to code

We don't modify or control these processes, but we ensure our output is compatible.

---

## Token Structure

### DTCG Format

All tokens follow the [Design Tokens Community Group](https://design-tokens.github.io/community-group/format/) specification:

```json
{
  "color": {
    "brand": {
      "300": {
        "$value": "#f96302",
        "$type": "color",
        "$description": "Primary brand orange"
      }
    }
  }
}
```

### Token Types

| Type | Description | Example |
|------|-------------|---------|
| `color` | Color value | `#f96302` |
| `dimension` | Size with unit | `16px` |
| `number` | Unitless number | `600` |
| `fontFamily` | Font stack | `"Open Sans", sans-serif` |
| `fontWeight` | Font weight | `600` |
| `duration` | Time value | `200ms` |
| `cubicBezier` | Easing function | `[0.4, 0, 0.2, 1]` |

### Naming Conventions

```
# Core tokens (system namespace)
system.color.{palette}.{shade}        # system.color.brand.300
system.dimension.{value}              # system.dimension.16
system.fontWeight.{name}              # system.fontWeight.semibold

# Semantic tokens
color.{category}.{variant}            # color.text.primary
color.{context}.{variant}             # color.surface.error

# Component tokens
{component}.{property}.{variant}      # button.background.primary
{component}.{property}.{state}        # button.background.hover
```

---

## Workflows

### Daily Design Work (Using Lint Roller)

```
1. Open Figma file
2. Run Lint Roller plugin
3. Scan current page or selection
4. Review violations and suggestions
5. Apply auto-fixes where possible
6. Manually fix remaining issues
7. Re-scan to verify
```

### Viewing Tokens (Using Design System Viewer)

```
1. Open Design System Viewer
2. Browse token categories
3. Toggle light/dark mode to compare
4. View iOS/Android rendering differences
5. Reference token paths for implementation
```

### Adding/Updating Tokens (Future: Token Editor)

```
1. Open Token Editor
2. Navigate to appropriate category
3. Create or edit token
4. Validate against DTCG schema
5. Preview in light/dark mode
6. Commit to GitHub
7. OCM pipeline validates and builds (automatic)
8. Sync to Figma via Lint Roller
```

### Current Token Editing Workflow (Manual)

Until the Token Editor is complete:

```
1. Edit token JSON files directly
2. Validate locally if OCM tools available
3. Commit to GitHub
4. OCM validates on PR
5. Merge triggers OCM build
6. Deploy tokens to GitHub Pages
7. Lint Roller fetches updated tokens
```

---

## Troubleshooting

### Lint Roller Issues

**"Failed to load tokens"**

1. Check GitHub Pages URL in `tokens-data.ts`
2. Verify token files are deployed
3. Check browser console for CORS errors

**"No suggestions for color"**

The color may be too far from any token (Delta E > 30). Consider:
1. Using a closer existing token
2. Requesting a new token be added

**"Orphaned variable binding"**

A variable was renamed or deleted. Use "Rebind" to select a new token or "Detach" to remove the binding.

### Design System Viewer Issues

**"Tokens not displaying"**

1. Check that token JSON files exist in expected location
2. Verify JSON syntax is valid
3. Check browser console for parsing errors

**"Theme toggle not working"**

1. Ensure both light and dark semantic tokens exist
2. Check that component references semantic tokens correctly

### OCM Validation Failures

If OCM reports validation errors after you commit:

| Error | Cause | Fix |
|-------|-------|-----|
| "Layer violation" | Semantic token references non-Core | Change reference to use `system.*` path |
| "Circular reference" | Token A → B → A | Break the cycle with a literal value |
| "Invalid reference" | Referenced token doesn't exist | Check path spelling, ensure target exists |
| "Missing $type" | Token lacks type declaration | Add `"$type": "color"` (or appropriate type) |

### Getting Help

- **Documentation:** Check this README and linked docs
- **Issues:** Open a GitHub issue for bugs or feature requests
- **Slack:** #design-system-support for quick questions

---

## Contributing

### Development Setup

```bash
git clone https://github.com/aspect-build/aspect-design-system.git
cd aspect-design-system
npm install
```

### Working on Design System Viewer

```bash
cd design-system-viewer
npm run dev
```

### Working on Lint Roller

```bash
cd "_Figma Plugin/Lint Roller"
npm install
npm run build
# Import manifest.json in Figma
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes
3. Test locally (Viewer in browser, Lint Roller in Figma)
4. Ensure tokens remain DTCG-compliant for OCM compatibility
5. Open pull request
6. Request review from design system team

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Conventional Commits for commit messages

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Acknowledgments

- [Design Tokens Community Group](https://design-tokens.github.io/community-group/) for the DTCG specification
- [Figma](https://www.figma.com/) for the Plugin API
- OCM Team for the token pipeline and platform code generation
- The Aspect Design System team for architecture and implementation
