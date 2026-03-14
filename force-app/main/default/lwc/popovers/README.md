# Popover (c-popovers)

This directory encompasses the source code for the Custom Popover LWC Component.

## Architectural Guidelines

This LWC component follows modern web standards and precise DOM encapsulation to ensure collision-free integrations anywhere within the Salesforce platform context. The internal structure prevents global stylistic bleed and avoids manual DOM traversal queries across unbounded DOM scopes.

### Module Breakdown

1.  **`popovers.js`**
    Primary web component class extending `LightningElement`. Handles state tracking, event bubbling controls (`stopPropagation`), visibility toggling, and layout coordinate offset calculation.

2.  **`helper.js`**
    Stateless utility functions processing placement properties into direct SLDS styling classes. Keeps the main component class pure and free of switch/case and long ternary string mapping logic.

3.  **`constants.js`**
    Source of truth mapping all supported directional variants, sizes, and layout conditions to respective Salesforce Lightning Design System strings.

4.  **`popovers.css` & `nubbinAdjustment.css`**
    CSS handling structural definition, transitions, and SVG popover arrows alignment. Custom CSS variables (e.g., `--popover-x-pos`) are updated interactively during `requestAnimationFrame` hooks mapped backward via JS layout bounds checking.

## Design Constraints
- Never append nodes recursively manually.
- Trigger dimensional recalculations linearly using the native SLDS classes mapping grid.
- All dependencies must be encapsulated within standard LWC slots architecture.
