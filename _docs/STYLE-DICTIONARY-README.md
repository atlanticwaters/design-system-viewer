# Style Dictionary Integration Reference

This document provides reference information about the OCM pipeline's Style Dictionary configuration. Understanding this helps us author tokens that integrate seamlessly with OCM.

> **Note:** The Style Dictionary configuration is maintained by the OCM team. This document is for reference only — we do not modify the OCM pipeline.

---

## Table of Contents

- [Overview](#overview)
- [How OCM Uses Our Tokens](#how-ocm-uses-our-tokens)
- [Token Format Requirements](#token-format-requirements)
- [Layer Rules](#layer-rules)
- [Naming Conventions](#naming-conventions)
- [What OCM Generates](#what-ocm-generates)
- [Troubleshooting OCM Validation](#troubleshooting-ocm-validation)

---

## Overview

### Our Role vs. OCM's Role

| Responsibility | Owner |
|---------------|-------|
| Authoring DTCG JSON tokens | **Us** (via Token Editor, manual editing) |
| Validating token structure | **OCM** (tokens-v2) |
| Transforming to platform code | **OCM** (Style Dictionary) |
| Generating wrapper APIs | **OCM** (tokens-v2 wrappers) |
| Code Connect validation | **OCM** |

### Pipeline Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Our Tools      │     │  OCM Pipeline   │     │  Platforms      │
│                 │     │                 │     │                 │
│  Token Editor   │────▶│  tokens-v2      │────▶│  iOS Swift      │
│  Lint Roller    │     │  Style Dict     │     │  Android Kotlin │
│                 │     │  Code Connect   │     │  Web CSS/TS     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
    DTCG JSON              Transforms              Platform Code
```

---

## How OCM Uses Our Tokens

### Token Discovery

OCM reads tokens from the `tokens/` directory:

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
└── $themes.json          # Theme/mode configuration
```

### Processing Steps

1. **Parse** — OCM reads all JSON files from `tokens/`
2. **Validate** — Checks DTCG compliance and layer rules
3. **Resolve** — Follows `{reference}` paths to final values
4. **Transform** — Converts values to platform-specific formats
5. **Generate** — Outputs Swift, Kotlin, CSS/TS files

---

## Token Format Requirements

### DTCG Specification

All tokens must follow the [Design Tokens Community Group](https://design-tokens.github.io/community-group/format/) format:

```json
{
  "token-name": {
    "$value": "the value or {reference}",
    "$type": "color",
    "$description": "Optional description"
  }
}
```

### Required Properties

| Property | Required | Description |
|----------|----------|-------------|
| `$value` | ✅ Yes | The token value (literal or reference) |
| `$type` | ⚠️ Recommended | Token type for transform selection |
| `$description` | Optional | Human-readable description |

### Supported Types

| Type | Example Value | Platform Output |
|------|--------------|-----------------|
| `color` | `#f96302`, `rgba(...)` | Color objects |
| `dimension` | `16px`, `1rem` | CGFloat, Dp, length |
| `number` | `600`, `1.5` | CGFloat, Float, number |
| `fontFamily` | `"Open Sans"` | String, FontFamily |
| `fontWeight` | `600` | Font.Weight, FontWeight |
| `duration` | `200ms` | TimeInterval, Long |
| `cubicBezier` | `[0.4, 0, 0.2, 1]` | Easing function |

### References

Tokens can reference other tokens using `{path}` syntax:

```json
{
  "color": {
    "action": {
      "primary": {
        "$value": "{system.color.brand.300}",
        "$type": "color"
      }
    }
  }
}
```

---

## Layer Rules

OCM enforces strict layer rules. Our tools must enforce the same rules to catch errors before OCM.

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CORE LAYER                                     │
│                          tokens/primitives/                                 │
│                                                                             │
│  • Raw values only — no references allowed                                  │
│  • Hardcoded literals permitted                                             │
│  • system.* namespace                                                       │
│                                                                             │
│  Examples:                                                                  │
│    system.color.brand.300 = "#f96302"                                       │
│    system.dimension.16 = "16px"                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Can reference Core only
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SEMANTIC LAYER                                   │
│                          tokens/semantic/                                   │
│                                                                             │
│  • MUST reference Core tokens                                               │
│  • NO hardcoded literals allowed                                            │
│  • Theme-specific files (light.json, dark.json)                             │
│                                                                             │
│  Examples:                                                                  │
│    color.text.primary = "{system.color.greige.900}"      ✅ Valid           │
│    color.text.primary = "#252524"                        ❌ Invalid         │
│    color.action.primary = "{color.text.primary}"         ❌ Invalid         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Can reference Semantic (preferred) or Core (allowlisted)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           COMPONENT LAYER                                   │
│                          tokens/component/                                  │
│                                                                             │
│  • SHOULD reference Semantic tokens                                         │
│  • MAY reference Core tokens (for specific allowlisted cases)               │
│  • NO hardcoded literals allowed                                            │
│                                                                             │
│  Examples:                                                                  │
│    button.background.primary = "{color.action.primary}"  ✅ Valid           │
│    button.background.primary = "{system.color.brand.300}" ⚠️ Allowed       │
│    button.background.primary = "#f96302"                 ❌ Invalid         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Layer Rule Summary

| Layer | Location | Can Reference | Hardcoded Values |
|-------|----------|---------------|------------------|
| Core | `tokens/primitives/` | Nothing | ✅ Allowed |
| Semantic | `tokens/semantic/` | Core only | ❌ Not allowed |
| Component | `tokens/component/` | Semantic preferred, Core allowlisted | ❌ Not allowed |

---

## Naming Conventions

### Token Paths

```
# Core tokens (system namespace)
system.color.{palette}.{shade}        # system.color.brand.300
system.dimension.{value}              # system.dimension.16
system.fontFamily.{name}              # system.fontFamily.openSans
system.fontSize.{value}               # system.fontSize.16
system.fontWeight.{name}              # system.fontWeight.semibold
system.borderRadius.{size}            # system.borderRadius.md
system.opacity.{level}                # system.opacity.50

# Semantic tokens
color.{category}.{variant}            # color.text.primary
color.{context}.{variant}             # color.surface.error
spacing.{context}.{property}          # spacing.component.padding

# Component tokens
{component}.{property}.{variant}      # button.background.primary
{component}.{property}.{state}        # button.background.hover
```

### Naming Rules

- Use kebab-case for multi-word segments: `brand-primary`, not `brandPrimary`
- Keep paths concise but descriptive
- Follow established patterns in existing tokens

---

## What OCM Generates

### iOS Swift Output

```swift
// Generated by OCM Style Dictionary
public enum SemanticColors {
    public enum Text {
        public static var primary: Color {
            Color("text-primary", bundle: .module)
        }
    }
}

// Wrapper API (generated by OCM)
public enum DSButtonTokens {
    public enum Background {
        public static var primary: Color {
            SemanticColors.Action.primary
        }
    }
}
```

### Android Kotlin Output

```kotlin
// Generated by OCM Style Dictionary
object SemanticColors {
    object Text {
        val primary: Color
            @Composable get() = colorResource(R.color.text_primary)
    }
}

// Wrapper API (generated by OCM)
object DSButtonTokens {
    object Background {
        val primary: Color
            @Composable get() = SemanticColors.Action.primary
    }
}
```

### Web Output

```css
/* Generated by OCM Style Dictionary */
:root {
  --color-text-primary: #252524;
  --color-action-primary: #f96302;
}
```

---

## Troubleshooting OCM Validation

When OCM validation fails, here's how to diagnose and fix common issues.

### Running OCM Validation Locally

If you have access to OCM tools:

```bash
npm run tokens-v2:validate
```

### Common Errors

#### "Layer violation: Semantic token references non-Core token"

**Cause:** A semantic token references another semantic token.

**Example:**
```json
// ❌ Wrong - semantic referencing semantic
{
  "color": {
    "text": {
      "primary": {
        "$value": "{color.action.primary}",  // This is semantic!
        "$type": "color"
      }
    }
  }
}
```

**Fix:** Reference a core token instead:
```json
// ✅ Correct - semantic referencing core
{
  "color": {
    "text": {
      "primary": {
        "$value": "{system.color.greige.900}",  // This is core
        "$type": "color"
      }
    }
  }
}
```

#### "Invalid reference: Token not found"

**Cause:** The referenced token path doesn't exist.

**Fix:**
1. Check for typos in the path
2. Verify the referenced token exists
3. Ensure the reference uses the full path

#### "Circular reference detected"

**Cause:** Token A references Token B which references Token A.

**Fix:** Break the cycle by having one token use a literal value (if allowed by layer rules).

#### "Missing $value property"

**Cause:** Token is missing the required `$value` property.

**Fix:** Add the `$value` property:
```json
{
  "token-name": {
    "$value": "#f96302",  // Add this
    "$type": "color"
  }
}
```

#### "Hardcoded value in semantic/component layer"

**Cause:** Using a literal value where a reference is required.

**Fix:** Replace the literal with a reference to a core token:
```json
// ❌ Wrong
{ "$value": "#f96302" }

// ✅ Correct
{ "$value": "{system.color.brand.300}" }
```

### Validation Checklist

Before committing token changes:

- [ ] All tokens have `$value` property
- [ ] All tokens have `$type` property (recommended)
- [ ] Core tokens use literal values only
- [ ] Semantic tokens reference Core tokens only
- [ ] Component tokens reference Semantic (or allowlisted Core)
- [ ] All references point to existing tokens
- [ ] No circular references
- [ ] Token paths follow naming conventions

---

## Contact

For OCM-specific questions or issues:
- **OCM Team:** Contact the OCM team for pipeline-related questions
- **Slack:** #design-system-support for general questions

For authoring tool questions:
- **Issues:** Open a GitHub issue
- **Slack:** #design-system-support
