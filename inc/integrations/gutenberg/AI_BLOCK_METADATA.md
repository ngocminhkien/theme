# AI block authoring metadata

This document defines how to create and maintain `attributes.ai.json` files for WoodMart Gutenberg blocks. It is intended for both developers and coding agents.

## Purpose

The runtime `attributes.js` schema describes storage: attribute names, types, defaults, responsive expansion, and configurable units. It usually does not explain authoring semantics such as:

- whether a number means pixels, percent, milliseconds, a count, or an ID;
- valid values shown by `SelectControl` or `ButtonSet`;
- min/max values enforced by editor controls;
- relationships between parent, child, and sibling blocks;
- attributes managed internally by editor effects;
- valid block trees and useful examples.

An `attributes.ai.json` file supplies this missing information. The catalog generator merges it with the runtime schema and exposes the result through `woodmart/gutenberg-describe-block`.

## Location and ownership

Place the file beside the block implementation:

```text
src/blocks/example/
├── attributes.js
├── attributes.ai.json
├── block.json
├── edit.js
├── save.js
└── css.php
```

Do not edit `blocks-catalog.generated.json` manually. It is generated directly in the
WoodMart MCP plugin at `inc/gutenberg/catalog/blocks-catalog.generated.json`.

Use `blocks-catalog.overrides.json` only for temporary global emergency overrides. Normal metadata belongs beside the block so it changes with the implementation.

## Required analysis

Before writing metadata, inspect all relevant sources:

1. `block.json` for the name, parent, ancestor, allowed blocks, and description.
2. `attributes.js` for exact attribute names, types, defaults, `xtsResponsive`, and `xtsUnits`.
3. `edit.js` for labels, options, min/max values, dependencies, templates, and editor-managed updates.
4. `save.js` and/or `render.php` for serialization and frontend meaning.
5. `css.php` for implicit units and how values are interpolated.
6. Shared components when the block uses sources such as `Carousel.Attributes` or advanced attribute groups.
7. `example.js`, transforms, and variations for valid block trees.

Never infer an option only from its label or attribute name when the implementation can be checked.

## File shape

```json
{
  "description": "One-sentence block purpose.",
  "whenToUse": "When an author should choose this block.",
  "contentAttribute": "content",
  "constraints": [
    "Parent/child or cross-attribute rule.",
    "Another rule that cannot be represented by a scalar attribute schema."
  ],
  "composition": {
    "requiresInnerBlocks": true,
    "templateLock": "insert",
    "allowedBlocks": ["wd/icon", "wd/container"],
    "minItems": 2,
    "maxItems": 2,
    "template": [
      {"name": "wd/icon", "attributes": {}},
      {"name": "wd/container", "attributes": {}, "innerBlocks": []}
    ]
  },
  "attributes": {
    "width": {
      "description": "Width as a numeric percentage. Use 25 for 25%.",
      "unit": "%",
      "minimum": 5,
      "maximum": 100,
      "examples": [25, 50],
      "resetValue": ""
    }
  },
  "example": {
    "name": "wd/example",
    "attributes": {
      "width": 50
    },
    "innerBlocks": [],
    "_note": "Optional authoring clarification."
  }
}
```

## Block-level fields

- `description`: What the block is and what it renders.
- `whenToUse`: The authoring situation where this block is appropriate.
- `contentAttribute`: Attribute containing visible text when automatic detection is insufficient.
- `constraints`: Tree-level and cross-attribute rules written as direct instructions.
- `composition`: Machine-readable inner-block requirements and a canonical starting template.
- `productSelectionAttributes`: Site-specific product/taxonomy selection fields when applicable.
- `example`: A valid block spec accepted by the Gutenberg abilities.

The generator rejects structural overrides such as `name`, `title`, `parent`, `supports`, `styleGroups`, and `composites`. Those belong to runtime sources.

### Composition fields

- `requiresInnerBlocks`: Set to `true` when the block is incomplete or invalid without child blocks. This flag is also returned by the compact `gutenberg-list-blocks` ability.
- `template`: Canonical `innerBlocks` block specs that an agent can copy when creating the block.
- `allowedBlocks`: Block names accepted as direct children.
- `templateLock`: Editor template locking mode (`false`, `"insert"`, or `"all"`).
- `minItems` / `maxItems`: Expected number of direct children when it is known.

Use `composition` only when inner blocks are part of the block's required structure, not merely because the block can optionally contain content. Keep `composition.template` consistent with the template in `edit.js` and with the block's full `example`.

## Attribute-level fields

- `description`: Exact meaning, storage format, and important usage rules.
- `options`: Exact stored values from the editor control, not translated labels.
- `unit`: A fixed implicit unit such as `%`, `px`, `ms`, or `s`.
- `minimum` / `maximum`: Limits enforced by the implementation or editor control.
- `examples`: Representative stored values with the correct JSON type.
- `resetValue`: Value that restores automatic/default behavior.
- `dependsOn`: Attribute relationship, expressed as a field name, array, or condition object.
- `requiredWith`: Attributes that must be authored together.
- `agentWritable: false`: Editor/runtime bookkeeping that an authoring agent should normally not set.

Do not repeat or override technical keys from `attributes.js`, including `type`, `default`, `source`, `selector`, `attribute`, `query`, `xtsResponsive`, or `xtsUnits`. The generator rejects them.

## Units

`unit` and generated `units` have different meanings:

- `unit: "%"` means the attribute value itself is always interpreted as a percentage. Example: `25` means `25%`.
- Generated `units: "px"` comes from `xtsUnits` and means the value has a companion attribute such as `heightUnits`. Author both values when overriding the default unit.

Example:

```json
{
  "height": "50",
  "heightUnits": "vh",
  "heightTablet": "400",
  "heightUnitsTablet": "px"
}
```

Check the attribute's runtime type. Many number controls store numeric strings rather than JSON numbers.

## Responsive attributes

An attribute marked `xtsResponsive` automatically accepts:

- `<name>` for desktop;
- `<name>Tablet` for tablet;
- `<name>Mobile` for mobile.

Do not add separate metadata entries for generated responsive variants. Describe the base attribute as responsive and use responsive variants in examples when they clarify behavior.

## Options and dependencies

Copy stored `value` fields exactly from controls. Do not copy labels. Values are case-sensitive.

For example, if the UI stores `DESC`, metadata must not advertise `desc`.

Use `dependsOn` to prevent agents from combining irrelevant fields:

```json
{
  "customAspectRatio": {
    "description": "Custom CSS aspect ratio.",
    "dependsOn": {
      "aspectRatio": "custom"
    }
  }
}
```

Put multi-block invariants in `constraints`, not in one attribute description. Examples include widths summing to 100, tab title counts matching panel counts, and parent/child restrictions.

## Internal and site-specific values

Mark transient editor state, cached dimensions, rerender markers, and copied parent state with `agentWritable: false`.

Explicitly identify site-specific IDs:

- post/product IDs;
- taxonomy term IDs;
- media attachment IDs;
- WordPress menu IDs.

Do not put real production IDs or credentials in examples. Either provide an ID-free query example or clearly state that placeholder IDs must be resolved on the target site.

## Examples

Every important structural block should have a complete, minimal example. An example must:

- use the exact block name;
- use correct JSON types;
- respect parent/child order;
- include bookkeeping required for static serialization;
- put visible text in content attributes rather than hand-written `innerHTML`;
- avoid arbitrary remote hosts except obvious placeholders that are explicitly marked for replacement;
- explain site-specific placeholders in `_note`.

For parent blocks such as rows, tabs, accordions, galleries, sliders, and carousels, include representative child blocks so the required tree is unambiguous.

## Generation and validation

Run from the parent theme directory:

```bash
npm run build:catalog --workspace=gutenberg
```

The normal Gutenberg build runs catalog generation automatically through `prebuild`:

```bash
npm run build:gutenberg
```

The generator is located at:

```text
build/scripts/generate-blocks-catalog.js
```

By default, the generator expects the plugin checkout at
`wp-content/plugins/woodmart-mcp`. Set `WOODMART_MCP_DIR` to an absolute or
working-directory-relative plugin path when the theme and plugin repositories use a
different layout:

```bash
WOODMART_MCP_DIR=/path/to/woodmart-mcp npm run build:catalog --workspace=gutenberg
```

When the WoodMart MCP plugin is not available, catalog generation is skipped and the
Gutenberg build continues normally.

It fails when:

- JSON is invalid;
- metadata references an unknown runtime attribute;
- metadata attempts to override a technical/structural field;
- `constraints` is not an array of strings;
- `example.name` does not match the block.

After generation:

1. Inspect the generated entry with `jq`.
2. Run `git diff --check`.
3. Run `npm run build:gutenberg` when generator/shared extraction changed.
4. Smoke-test `woodmart/gutenberg-describe-block` through `wood-local` for changed blocks.

## Review checklist

- [ ] Block purpose and selection guidance are clear.
- [ ] Exact option values match `edit.js`.
- [ ] Units and JSON value types match CSS/rendering code.
- [ ] Min/max values match controls and runtime clamping.
- [ ] Responsive behavior is documented.
- [ ] Dependencies and reset behavior are documented.
- [ ] Internal state is marked `agentWritable: false`.
- [ ] Parent/child and sibling invariants are in `constraints`.
- [ ] Site-specific IDs are identified.
- [ ] The example is a valid minimal block tree.
- [ ] Generated files were rebuilt and the live ability was smoke-tested.
