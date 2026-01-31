# Product Requirements Document: Design Token Authoring Tools

## Document Information

| Field | Value |
|-------|-------|
| **Project Name** | Design Token Authoring Tools |
| **Version** | 2.0.0 |
| **Last Updated** | January 2026 |
| **Status** | In Progress |
| **Owner** | App Design System Team |

---

## Executive Summary

### Problem Statement

The current design token workflow using Tokens Studio presents significant challenges:

1. **Poor Documentation & Onboarding** — Tokens Studio's documentation is cryptic and complex, making it difficult for team members to understand and use effectively.

2. **Unnecessary Complexity** — The graph engine and dynamic tokens add conceptual overhead without providing value for our build-time composition workflow.

3. **Unreliable Figma Integration** — The Figma plugin requires manual validation and cleanup, creating friction rather than reducing it.

4. **Misaligned Value Proposition** — We're paying for features we don't use (cloud sync, graph engine) while the features we need (reliable Figma sync, clear documentation) are underdelivered.

5. **Redundant Tooling** — Since our DTCG-compliant JSON files in GitHub are the source of truth and OCM handles our builds, Tokens Studio is merely an overpriced JSON editor.

### Solution Overview

Build purpose-built **authoring tools** that output DTCG-compliant JSON compatible with the existing OCM pipeline:

| Component | Description | Status |
|-----------|-------------|--------|
| **Design System Viewer** | Visual token browser and component reference | ✅ Complete |
| **Token Editor** | CRUD operations with GitHub integration | 🚧 Planned |
| **Lint Roller** | Figma plugin for design linting and auto-fix | ✅ Complete |

### Scope Clarification

**Our Responsibility:**
- Design System Viewer (visual reference)
- Token Editor (authoring interface)
- Lint Roller (Figma plugin)
- DTCG JSON output

**OCM Team Responsibility (Not Our Scope):**
- tokens-v2 validation pipeline
- Style Dictionary configuration
- Code Connect validation
- Platform code generation (iOS/Android/Web)

We are **upstream** of OCM — our tools produce DTCG JSON that OCM consumes.

### Success Metrics

| Metric | Previous State | Target State |
|--------|---------------|--------------|
| Time to onboard new team member | 2-3 days | 2-4 hours |
| Token update → Figma sync time | 30+ minutes (manual) | < 5 minutes |
| Token validation errors caught before OCM | 0% | 95%+ |
| Team confidence in token workflow | Low | High |
| Monthly tooling cost | Tokens Studio subscription | $0 |

---

## Stakeholders

| Role | Name/Team | Responsibilities |
|------|-----------|------------------|
| Product Owner | App Design System Team | Requirements, prioritization, acceptance |
| Design Operations | Design Ops Team | Token authoring, Figma integration |
| OCM Team | OCM Team | Token pipeline (external dependency) |
| Platform Engineering | iOS/Android Teams | Consume OCM-generated tokens |
| Web Engineering | Web Team | Consume OCM-generated tokens |

---

## Scope

### In Scope

| Item | Owner | Status |
|------|-------|--------|
| Design System Viewer web application | Us | ✅ Complete |
| Token visualization and browsing | Us | ✅ Complete |
| Lint Roller Figma plugin | Us | ✅ Complete |
| Design linting and auto-fix | Us | ✅ Complete |
| Token Editor web application | Us | 🚧 Planned |
| Token CRUD operations | Us | 🚧 Planned |
| GitHub integration (read/write) | Us | 🚧 Planned |
| DTCG validation (matching OCM rules) | Us | 🚧 Planned |

### Out of Scope (OCM Responsibility)

| Item | Owner |
|------|-------|
| tokens-v2 validation pipeline | OCM Team |
| Style Dictionary configuration | OCM Team |
| Custom transforms and formats | OCM Team |
| Code Connect validation | OCM Team |
| Platform code generation | OCM Team |
| iOS/Android/Web outputs | OCM Team |
| CI/CD pipeline for builds | OCM Team |

### Out of Scope (Future)

- Real-time multi-user collaboration (Git handles this)
- Visual token diff between branches (use GitHub PR view)
- Figma-to-tokens sync (one-way only: tokens → Figma)
- MCP server for AI workflows

---

## User Personas

### Persona 1: Design System Designer

**Name:** Sarah  
**Role:** Senior Product Designer, Design Systems  

**Goals:**
- Quickly view and understand design tokens
- Create and update tokens with visual feedback
- Ensure tokens are correctly reflected in Figma
- Identify hardcoded values in designs

**Current Solution:**
- ✅ Design System Viewer for token visualization
- ✅ Lint Roller for identifying hardcoded values
- ✅ Auto-fix for binding to correct tokens
- 🚧 Token Editor for creating/updating tokens

**Remaining Needs:**
- Visual token editor with type-aware inputs
- GitHub integration for committing changes

### Persona 2: Design Ops Lead

**Name:** Alex  
**Role:** Design Operations Manager  

**Goals:**
- Maintain design system consistency
- Onboard new team members quickly
- Ensure tokens validate before OCM processes them
- Reduce back-and-forth with OCM team

**Current Solution:**
- ✅ Lint Roller for design auditing
- ✅ Design System Viewer for reference
- 🚧 Token Editor with validation

**Remaining Needs:**
- Validation that catches errors before OCM
- Clear documentation of layer rules

---

## Requirements

### Functional Requirements

#### FR-1: Token Visualization (✅ Complete)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-1.1 | Display tokens in organized categories | P0 | ✅ |
| FR-1.2 | Visual preview for all token types | P0 | ✅ |
| FR-1.3 | Support light/dark theme switching | P0 | ✅ |
| FR-1.4 | Show iOS/Android comparison | P1 | ✅ |
| FR-1.5 | Component gallery with live examples | P1 | ✅ |

#### FR-2: Design Linting (✅ Complete)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-2.1 | Detect hardcoded colors | P0 | ✅ |
| FR-2.2 | Detect hardcoded typography | P0 | ✅ |
| FR-2.3 | Detect hardcoded spacing | P1 | ✅ |
| FR-2.4 | Detect hardcoded radii | P1 | ✅ |
| FR-2.5 | Detect orphaned variable bindings | P0 | ✅ |
| FR-2.6 | Suggest closest matching tokens | P0 | ✅ |
| FR-2.7 | Auto-fix violations | P0 | ✅ |
| FR-2.8 | Bulk fix operations | P1 | ✅ |
| FR-2.9 | Export results to JSON/CSV | P2 | ✅ |

#### FR-3: Token Editing (🚧 Planned)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-3.1 | Load tokens from GitHub repository | P0 | 🚧 |
| FR-3.2 | Edit token values with type-aware inputs | P0 | 🚧 |
| FR-3.3 | Create new tokens with validation | P0 | 📋 |
| FR-3.4 | Delete tokens with impact analysis | P1 | 📋 |
| FR-3.5 | Reference other tokens via picker | P0 | 📋 |
| FR-3.6 | Filter references by valid layers | P0 | 📋 |
| FR-3.7 | Real-time validation feedback | P0 | 📋 |
| FR-3.8 | Preview resolved values | P1 | 📋 |

#### FR-4: GitHub Integration (🚧 Planned)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-4.1 | GitHub OAuth authentication | P0 | 📋 |
| FR-4.2 | Track pending changes | P0 | 📋 |
| FR-4.3 | Commit changes directly to branch | P0 | 📋 |
| FR-4.4 | Create pull requests for review | P1 | 📋 |
| FR-4.5 | Display commit success/error | P0 | 📋 |

#### FR-5: Validation (🚧 Planned)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-5.1 | Validate DTCG schema compliance | P0 | 📋 |
| FR-5.2 | Validate layer reference rules | P0 | 📋 |
| FR-5.3 | Detect invalid references | P0 | 📋 |
| FR-5.4 | Warn on naming convention violations | P2 | 📋 |
| FR-5.5 | Match OCM validation rules exactly | P0 | 📋 |

### Non-Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| NFR-1 | Viewer loads in < 3 seconds | P1 | ✅ |
| NFR-2 | Lint Roller scans page in < 5 seconds | P1 | ✅ |
| NFR-3 | Editor validation runs in < 100ms | P1 | 📋 |
| NFR-4 | Works offline after initial load | P2 | ✅ |
| NFR-5 | Accessible (WCAG 2.1 AA) | P1 | 🚧 |

---

## Architecture

### System Context

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          OUR RESPONSIBILITY                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │  Design System   │    │   Token Editor   │    │   Lint Roller    │      │
│  │  Viewer          │    │   (Planned)      │    │   (Figma)        │      │
│  │                  │    │                  │    │                  │      │
│  │  • View tokens   │    │  • Edit tokens   │    │  • Lint designs  │      │
│  │  • Browse        │    │  • Validate      │    │  • Auto-fix      │      │
│  │  • Compare       │    │  • Commit        │    │  • Suggestions   │      │
│  └──────────────────┘    └────────┬─────────┘    └──────────────────┘      │
│                                   │                                         │
│                                   ▼                                         │
│                          ┌──────────────────┐                               │
│                          │     GitHub       │                               │
│                          │  (DTCG JSON)     │                               │
│                          └────────┬─────────┘                               │
│                                   │                                         │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │
                                    │ Our Output: DTCG JSON
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          OCM RESPONSIBILITY                                │
│                                                                            │
│  tokens-v2 → Style Dictionary → Code Connect → iOS/Android/Web            │
└───────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Design System Viewer** | React 18 + TypeScript + Vite | Existing implementation |
| **Token Editor** | React 18 + TypeScript + Vite | Extends Viewer |
| **Lint Roller** | Figma Plugin API + Preact | Existing implementation |
| **Hosting** | GitHub Pages | Zero cost, simple deployment |
| **Authentication** | GitHub OAuth | Native integration for commits |

### OCM Integration Points

| Integration | Our Output | OCM Input |
|-------------|-----------|-----------|
| Token Files | DTCG JSON in `tokens/` directory | tokens-v2 reads these files |
| Metadata | `$metadata.json` | tokens-v2 uses for ordering |
| Themes | `$themes.json` | tokens-v2 uses for mode mapping |

### DTCG Compliance

All tokens must follow DTCG format for OCM compatibility:

```json
{
  "token-name": {
    "$value": "value or {reference}",
    "$type": "color | dimension | number | ...",
    "$description": "Optional description"
  }
}
```

### Layer Rules (Must Match OCM)

| Layer | Can Reference | Hardcoded Values |
|-------|---------------|------------------|
| Core (primitives/) | Nothing | ✅ Allowed |
| Semantic (semantic/) | Core only | ❌ Not allowed |
| Component (component/) | Semantic preferred, Core allowlisted | ❌ Not allowed |

---

## User Interface Specifications

### Token Editor - Main View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎨 Token Editor                          [Search...] [Dark] [Commit (3)]  │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Overview] [Colors] [Typography] [Spacing] [Components]                    │
├────────────────────┬────────────────────────────────────────────────────────┤
│                    │                                                        │
│  📁 Token Files    │  Colors > Semantic > Light                             │
│                    │  ────────────────────────────────────────────────────  │
│  ▼ primitives/     │                                                        │
│    colors.json     │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│    spacing.json    │  │ ███████ │ │ ███████ │ │ ███████ │ │ ███████ │      │
│    typography.json │  │ text.   │ │ text.   │ │ action. │ │ surface.│      │
│                    │  │ primary │ │ second. │ │ primary │ │ primary │      │
│  ▼ semantic/       │  │         │ │         │ │         │ │         │      │
│    light.json  ●   │  │ [Edit]  │ │ [Edit]  │ │ [Edit]  │ │ [Edit]  │      │
│    dark.json       │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                    │                                                        │
│  ▼ component/      │                                                        │
│    button.json     │  ────────────────────────────────────────────────────  │
│    card.json       │                                                        │
│                    │  + Add Token                                           │
│                    │                                                        │
└────────────────────┴────────────────────────────────────────────────────────┘
```

### Token Editor - Edit Panel

```
┌────────────────────────────────────────┐
│  Edit Token                      [×]   │
│  ──────────────────────────────────    │
│                                        │
│  Path: color.text.primary              │
│  Layer: semantic                       │
│                                        │
│  Value                                 │
│  ┌──────────────────────────────────┐  │
│  │ {system.color.greige.900}    [▼]│  │
│  └──────────────────────────────────┘  │
│  [Use Literal] [Use Reference]         │
│                                        │
│  Resolves to: #252524                  │
│  ┌────────┐                            │
│  │████████│ Preview                    │
│  └────────┘                            │
│                                        │
│  Type                                  │
│  ┌──────────────────────────────────┐  │
│  │ color                         [▼]│  │
│  └──────────────────────────────────┘  │
│                                        │
│  Description                           │
│  ┌──────────────────────────────────┐  │
│  │ Primary text color for light    │  │
│  │ mode surfaces                   │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ✓ Valid                               │
│                                        │
│  [Cancel]                    [Save]    │
└────────────────────────────────────────┘
```

### Lint Roller - Main View (Existing)

```
┌─────────────────────────────────────────┐
│  Lint Roller                    [···]   │
├─────────────────────────────────────────┤
│                                         │
│  Scan: [Selection] [Page] [Document]    │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  12 violations found                    │
│  ┌─────────────────────────────────────┐│
│  │ Fixed: 0  Fixable: 8  Manual: 4    ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ▼ no-hardcoded-colors (6)              │
│    Rectangle 1: #F96302                 │
│    → Suggest: color.brand.300 [Fix]     │
│                                         │
│    Frame 2 / Fill: #252524              │
│    → Suggest: color.text.primary [Fix]  │
│                                         │
│  ▼ no-orphaned-variables (2)            │
│    Button / Fill: old-brand-color       │
│    → [Rebind] [Detach]                  │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  [Fix All Fixable] [Export Results]     │
│                                         │
└─────────────────────────────────────────┘
```

---

## Timeline

### Completed Work

| Phase | Duration | Status |
|-------|----------|--------|
| Design System Viewer | 4 weeks | ✅ Complete |
| Lint Roller Plugin | 6 weeks | ✅ Complete |

### Remaining Work

#### Phase 1: Token Editor Foundation (2-3 weeks)

| Week | Deliverables |
|------|--------------|
| 1 | Project setup, token loading, parsing |
| 2 | Editor UI, type-aware inputs, reference selector |
| 3 | Validation (matching OCM rules), preview |

**Exit Criteria:**
- [ ] Tokens load from GitHub
- [ ] Editor panel opens on token click
- [ ] Type-aware inputs work correctly
- [ ] References selectable from valid layers only
- [ ] Validation matches OCM rules

#### Phase 2: GitHub Integration (1-2 weeks)

| Week | Deliverables |
|------|--------------|
| 4 | GitHub OAuth, API wrapper |
| 5 | Commit dialog, PR creation |

**Exit Criteria:**
- [ ] Users can authenticate with GitHub
- [ ] Changes tracked in pending queue
- [ ] Direct commits work
- [ ] PR creation works
- [ ] Committed tokens pass OCM validation

#### Phase 3: Polish & Documentation (1 week)

| Week | Deliverables |
|------|--------------|
| 6 | Error handling, edge cases, documentation |

**Exit Criteria:**
- [ ] Error states handled gracefully
- [ ] Documentation complete
- [ ] Team trained on workflow

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Validation rules don't match OCM | Medium | High | Test with OCM tools, collaborate with OCM team |
| GitHub API rate limiting | Medium | Medium | Implement caching, batch requests |
| OAuth complexity | Low | Medium | Use established OAuth libraries |
| Team bandwidth constraints | High | Medium | Prioritize core features, phase delivery |

---

## OCM Compatibility Checklist

Before considering Token Editor complete, verify:

- [ ] Tokens pass `npm run tokens-v2:validate`
- [ ] Layer rules enforced match OCM exactly
- [ ] Reference validation matches OCM exactly
- [ ] DTCG schema compliance matches OCM exactly
- [ ] Token file structure matches OCM expectations
- [ ] `$metadata.json` format correct
- [ ] `$themes.json` format correct

---

## Appendix

### A. DTCG Token Format

```json
{
  "color": {
    "text": {
      "primary": {
        "$value": "{system.color.greige.900}",
        "$type": "color",
        "$description": "Primary text color"
      }
    }
  }
}
```

### B. Token File Structure

```
tokens/
├── primitives/           # Core layer
│   ├── colors.json
│   ├── spacing.json
│   └── typography.json
├── semantic/             # Semantic layer
│   ├── light.json
│   └── dark.json
├── component/            # Component layer
│   ├── button.json
│   └── card.json
├── $metadata.json        # Token set ordering
└── $themes.json          # Theme configuration
```

### C. Glossary

| Term | Definition |
|------|------------|
| **DTCG** | Design Tokens Community Group — W3C community group defining token specification |
| **OCM** | Our internal token pipeline that processes DTCG JSON |
| **Core Token** | Primitive value (raw color, spacing value, etc.) |
| **Semantic Token** | Named alias referencing core tokens with usage meaning |
| **Component Token** | Component-specific token referencing semantic tokens |
| **Token Reference** | Pointer to another token using `{path}` syntax |
| **Lint Roller** | Our Figma plugin for design linting |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01 | App Design System Team | Initial draft |
| 2.0.0 | 2026-01 | App Design System Team | Revised scope to focus on authoring tools only, clarified OCM as external system |
