# Custom Popover LWC Component

A high-performance, responsive Custom Popover built natively for Salesforce Lightning Web Components (LWC). This component provides non-modal overlay dialogs configured for arbitrary content, automatic edge-collision detection, and full compliance with the Salesforce Lightning Design System (SLDS).

## Features

-   **Dynamic Auto-Positioning:** Calculates viewport constraints during `requestAnimationFrame` boundaries to guarantee the popover does not overflow off-screen by actively recalculating bounds (`top`, `bottom`, `left`, `right`).
-   **Style Encapsulation:** Unlike standard implementations that mutate `document.body.style` directly, this component strictly assigns variables via discrete CSS Custom Properties injected onto the relative parent, maintaining strict Shadow DOM scope.
-   **Variant & Size Control:** Supports granular configurations using core SLDS contextual tokens (`error`, `brand`, `warning`, `walkthrough`, etc.) directly via properties mapped instantly into component getters.
-   **Performance-First Reactivity:** Relies on passive `onslotchange` events to detect content additions rather than expensive `renderedCallback` cycles, and calculates layout positions only strictly upon component initialization and visbility threshold crossings.

## Implementation Architecture

-   `popovers.js`: Governs DOM states, event listeners (hover, click, blur), and coordinate math.
-   `helper.js`: Utility registry encapsulating CSS class interpolations, string manipulations, and conditional resolution maps.
-   `constants.js`: Fixed dictionary providing explicit references to SLDS string markers and variant maps.
-   `popovers.css`: Applies structure, transitions, and z-index contexts to the elements.
-   `nubbinAdjustment.css`: Specifically isolates the positioning for the visual SVG nubbin (arrow), shifting securely alongside overflow collision events.

## Usage

```html
<c-popovers variant="brand" size="medium" placement="top" with-close="true">
    <!-- Hover or Click Trigger Element -->
    <div slot="value">
        <lightning-button label="Show Info"></lightning-button>
    </div>
    
    <!-- Popover Body HTML Content -->
    <div slot="header">
        <h2 class="slds-text-heading_small">Information</h2>
    </div>
    <div slot="body">
        <p>This is the main body content of the popover.</p>
    </div>
</c-popovers>
```

## API Reference

### Attributes

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `String` | `medium` | Structural bounds: `small`, `medium`, `large`. |
| `variant` | `String` | `base` | Styling modifier: `base`, `warning`, `error`, `brand`, `success`, `walk`, `walkalt`. |
| `placement` | `String` | `top` | Anchoring direction relative to trigger: `top`, `bottom`, `left`, `right`. |
| `with-close` | `Boolean` | `false` | Renders a manual close icon, suppressing implicit `mouseleave` dismissal behavior. |

### Slots

| Name | Description |
| :--- | :--- |
| `value` | The trigger element. Hover over to auto-invoke visibility. |
| `link` | An alternative trigger slot wrapped internally in an `<a>` tag invoking a toggle action per click rather than hover. |
| `header` | *(Optional)* The header title block text/HTML. |
| `body` | The core display region of the popover widget. |
| `footer` | *(Optional)* The footer action region, typically reserved for confirmation/cancellation buttons. |
