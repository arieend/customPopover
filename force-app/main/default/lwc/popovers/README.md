# Popover Component - Technical Implementation

This component is a high-performance, dynamic popover for the Salesforce Lightning Web Component framework. It avoids common LWC pitfalls like global style mutation and manual DOM checking.

## Technical Highlights

### 1. Style Encapsulation
Unlike the original implementation which modified `document.body.style`, this component uses local **CSS Custom Properties (Variables)**.
*   The `popoverStyle` calculation happens in JavaScript.
*   Values are applied via `popover.style.setProperty()` to the internal container.
*   This ensures that multiple popovers on the same page do not conflict with each other.

### 2. Performance-First Positioning
*   **Coordinate Calculation:** Occurs during `requestAnimationFrame` to ensure the DOM is ready and dimensions are accurate.
*   **Reactive Rendering:** Uses `onslotchange` to detect content changes rather than expensive `renderedCallback` checks.
*   **Visibility Control:** Leverages CSS visibility and opacity for smooth transitions and reduced layout shifts.

### 3. Case-Insensitive API
The component's properties (like `placement` and `variant`) are case-insensitive. Input values are automatically mapped to uppercase constants in `helper.js`.

## Internal Architecture

*   `popovers.js`: Manages visibility state, event handling (hover, click, blur), and coordinate math.
*   `helper.js`: Pure utility functions for CSS class generation and positioning calculations.
*   `constants.js`: Source of truth for SLDS classes and supported variants.
*   `popovers.css`: Handles layout structure and transitions.
*   `nubbinAdjustment.css`: Specifically manages the visual nubbin (triangle) position for screen overflows.

## Development Notes

*   **Boundary Checking:** The component uses `getBoundingClientRect()` relative to the viewport.
*   **Nubbin Adjustment:** If a popover is moved to avoid screen overflow, the nubbin (arrow) is automatically recalculated to stay aligned with the trigger element.

## Screenshots

*   **Basic Popover:** `../../../../docs/images/output1.jpg`
*   **Complex Table Content:** `../../../../docs/images/output2.jpg`
