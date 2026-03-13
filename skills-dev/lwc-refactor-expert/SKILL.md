---
name: lwc-refactor-expert
description: Auditing and refactoring Salesforce Lightning Web Components (LWC). Use when cleaning up legacy LWC code, fixing encapsulation issues (Shadow DOM), improving performance (requestAnimationFrame), and ensuring SLDS compliance.
---

# LWC Refactor Expert

This skill provides a comprehensive workflow for transforming legacy or "flat" LWC code into high-performance, encapsulated, and professional Salesforce components.

## Core Workflows

### 1. Audit & Fix Style Encapsulation
**Anti-pattern**: `document.body.style.setProperty(...)`
**Best Practice**: Use local CSS Variables + `style.setProperty()` on component elements.
1.  Identify any direct manipulation of the global `document` or `window`.
2.  Refactor dynamic styling to use CSS Custom Properties (e.g., `--popover-x-pos`).
3.  Apply these properties directly to the template's internal elements using `this.template.querySelector('.target').style.setProperty()`.

### 2. Performance-First Dynamic Positioning
**Anti-pattern**: Calculating coordinates inside `renderedCallback` or standard event loops.
**Best Practice**: Use `requestAnimationFrame` and reactive slot handling.
1.  Replace manual content checks with `onslotchange` handlers.
2.  Execute viewport boundary calculations (e.g., `getBoundingClientRect()`) within `requestAnimationFrame` to ensure the DOM is stable.
3.  Handle screen overflows by shifting the component and recalculating "nubbin" (triangle) offsets.

### 3. API Cleanliness & Case-Insensitivity
**Anti-pattern**: Hard-coded lowercase strings in JS logic that break when users pass different cases.
**Best Practice**: Use normalized constants and helper functions.
1.  Consolidate `VARIANTS`, `SIZES`, and `PLACEMENTS` into a `constants.js` file.
2.  Use helper functions in `helper.js` that call `.toUpperCase()` on input values to ensure robust API handling.
3.  Avoid `Proxy` objects in constants unless strictly necessary for complex dynamic mapping; prefer plain objects for better performance.

### 4. Shadow DOM & Naming Safety
1.  Check for property name shadowing (e.g., a local property named exactly like an imported helper function).
2.  Ensure each instance has a truly unique identifier generated in the class constructor/init, not once at the module level.
3.  Remove unnecessary `@track` decorators on primitive properties in modern LWC.

## References

*   See `references/positioning-math.md` for reusable viewport boundary logic.
*   See `references/slds-variants.md` for standard SLDS class names and patterns.
