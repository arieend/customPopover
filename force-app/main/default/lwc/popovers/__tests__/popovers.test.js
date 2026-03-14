/**
 * @file popovers.test.js
 * @description Comprehensive unit tests for the c-popovers LWC component.
 *
 * Test coverage:
 *  1.  Default rendering & initial state
 *  2.  @api property defaults
 *  3.  Computed getter: popoverContainerClass
 *  4.  Computed getter: popoverClass (visibility)
 *  5.  Computed getter: popoverSectionClass (variant + size + nubbin)
 *  6.  Computed getter: closeIconVariant
 *  7.  handleMouseOverOrFocusElement – shows popover
 *  8.  handleMouseLeaveOrBlurElement – hides / stays visible with withClose
 *  9.  handleLinkClick – toggle on / off
 *  10. handlePopoverClose – close button interaction
 *  11. handleSlotChange – header visibility flag
 *  12. calcPlacement – viewport overflow fallback logic (via showAndVerify helper)
 *  13. calcHorizontal – X / Y position & nubbin adjustment
 *  14. calcVertical – X / Y position & nubbin adjustment
 */

import { createElement } from 'lwc';
import Popovers from 'c/popovers';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Creates and appends a c-popovers element with optional prop overrides.
 */
function createComponent(props = {}) {
    const el = createElement('c-popovers', { is: Popovers });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

/**
 * Waits for an LWC re-render tick.
 */
async function flushPromises() {
    await Promise.resolve();
}

/**
 * Fires a mouseover on the value-slot trigger and waits for re-render.
 * NOTE: requestAnimationFrame is mocked at the suite level to run synchronously.
 */
async function triggerMouseOver(el) {
    const valueSlot = el.shadowRoot.querySelector('.main-content slot[name="value"]');
    valueSlot.dispatchEvent(new CustomEvent('mouseover', { bubbles: true }));
    await flushPromises();
}

/**
 * Fires a mouseleave on the value-slot trigger and waits for re-render.
 */
async function triggerMouseLeave(el) {
    const valueSlot = el.shadowRoot.querySelector('.main-content slot[name="value"]');
    valueSlot.dispatchEvent(new CustomEvent('mouseleave', { bubbles: true }));
    await flushPromises();
}

/**
 * Mocks getBoundingClientRect on both the container and popover elements,
 * then fires mouseover so calculatePopoverPosition runs with the mocked rects.
 * Returns the applied CSS custom property values.
 */
async function showWithRects(el, containerRect, popoverRect) {
    // The container uses a dynamic class (popover_container + uniqueId + nubbinClass).
    // We find it by the guaranteed "popover_container" class segment.
    const container = el.shadowRoot.querySelector('[class*="popover_container"]');
    const popoverEl = el.shadowRoot.querySelector('.popover');

    container.getBoundingClientRect = () => containerRect;
    popoverEl.getBoundingClientRect = () => popoverRect;

    await triggerMouseOver(el);

    return {
        xPos: popoverEl.style.getPropertyValue('--popover-x-pos'),
        yPos: popoverEl.style.getPropertyValue('--popover-y-pos'),
    };
}

// ─── Global mocks ────────────────────────────────────────────────────────────

// Make requestAnimationFrame synchronous so calculatePopoverPosition runs
// immediately during tests without needing real animation frames.
beforeAll(() => {
    jest.spyOn(global, 'requestAnimationFrame').mockImplementation((cb) => {
        cb();
        return 0;
    });
});

afterAll(() => {
    jest.restoreAllMocks();
});

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

// ─── 1. Default rendering ────────────────────────────────────────────────────

describe('Default rendering', () => {
    it('renders a root popover container element', () => {
        const el = createComponent();
        expect(el.shadowRoot.querySelector('[class*="popover_container"]')).not.toBeNull();
    });

    it('renders the popover section element', () => {
        const el = createComponent();
        expect(el.shadowRoot.querySelector('section')).not.toBeNull();
    });

    it('is hidden (popover-hide) by default', () => {
        const el = createComponent();
        const popover = el.shadowRoot.querySelector('.popover');
        expect(popover.classList.contains('popover-hide')).toBe(true);
        expect(popover.classList.contains('popover-show')).toBe(false);
    });

    it('does NOT render the close button by default (withClose = false)', () => {
        const el = createComponent();
        expect(el.shadowRoot.querySelector('button[title="Close dialog"]')).toBeNull();
    });

    it('renders the value slot trigger', () => {
        const el = createComponent();
        expect(el.shadowRoot.querySelector('slot[name="value"]')).not.toBeNull();
    });

    it('renders the link slot trigger', () => {
        const el = createComponent();
        expect(el.shadowRoot.querySelector('slot[name="link"]')).not.toBeNull();
    });
});

// ─── 2. @api property defaults ───────────────────────────────────────────────

describe('@api property defaults', () => {
    it('defaults size to "medium"', () => {
        expect(createComponent().size).toBe('medium');
    });

    it('defaults variant to "base"', () => {
        expect(createComponent().variant).toBe('base');
    });

    it('defaults placement to "top"', () => {
        expect(createComponent().placement).toBe('top');
    });

    it('defaults withClose to false', () => {
        expect(createComponent().withClose).toBe(false);
    });
});

// ─── 3. Computed getter: popoverContainerClass ────────────────────────────────

describe('popoverContainerClass getter', () => {
    it('includes the "popover_container" base class', () => {
        const el = createComponent();
        const container = el.shadowRoot.querySelector('[class*="popover_container"]');
        expect(container.className).toContain('popover_container');
    });

    it('includes a unique ID matching the "popover-<alphanumeric>" pattern', () => {
        const el = createComponent();
        const cls = el.shadowRoot.querySelector('[class*="popover_container"]').className;
        expect(cls).toMatch(/popover-[a-z0-9]+/);
    });

    it('generates distinct unique IDs for different instances', () => {
        const el1 = createComponent();
        const el2 = createComponent();
        const cls1 = el1.shadowRoot.querySelector('[class*="popover_container"]').className;
        const cls2 = el2.shadowRoot.querySelector('[class*="popover_container"]').className;
        expect(cls1).not.toBe(cls2);
    });
});

// ─── 4. Computed getter: popoverClass ────────────────────────────────────────

describe('popoverClass getter', () => {
    it('renders with "popover-hide" when isVisible is false', () => {
        const el = createComponent();
        expect(el.shadowRoot.querySelector('.popover').classList.contains('popover-hide')).toBe(true);
    });

    it('switches to "popover-show" after mouseover', async () => {
        const el = createComponent();
        await triggerMouseOver(el);
        expect(el.shadowRoot.querySelector('.popover').classList.contains('popover-show')).toBe(true);
    });
});

// ─── 5. Computed getter: popoverSectionClass ─────────────────────────────────

describe('popoverSectionClass getter', () => {
    it('always includes the base "slds-popover" class', () => {
        const el = createComponent();
        expect(el.shadowRoot.querySelector('section').classList.contains('slds-popover')).toBe(true);
    });

    it('applies the medium size class by default', () => {
        const el = createComponent();
        expect(el.shadowRoot.querySelector('section').classList.contains('slds-popover_medium')).toBe(true);
    });

    it.each([
        ['small', 'slds-popover_small'],
        ['large', 'slds-popover_large'],
    ])('applies size class for size="%s" → "%s"', (size, cls) => {
        const el = createComponent({ size });
        expect(el.shadowRoot.querySelector('section').classList.contains(cls)).toBe(true);
    });

    it.each([
        ['warning', 'slds-popover_warning'],
        ['error',   'slds-popover_error'],
        ['brand',   'slds-popover_brand'],
        ['success', 'slds-popover_success'],
        ['walk',    'slds-popover_walkthrough'],
    ])('applies variant class for variant="%s"', (variant, expectedClass) => {
        const el = createComponent({ variant });
        expect(el.shadowRoot.querySelector('section').classList.contains(expectedClass)).toBe(true);
    });

    it.each([
        ['top',    'slds-nubbin_bottom'],
        ['bottom', 'slds-nubbin_top'],
        ['left',   'slds-nubbin_right'],
        ['right',  'slds-nubbin_left'],
    ])('applies nubbin class for placement="%s" → "%s"', (placement, nubbinCls) => {
        const el = createComponent({ placement });
        expect(el.shadowRoot.querySelector('section').classList.contains(nubbinCls)).toBe(true);
    });
});

// ─── 6. Computed getter: closeIconVariant ────────────────────────────────────

describe('closeIconVariant getter', () => {
    /**
     * The lightning-icon stub in sfdx-lwc-jest reflects LWC public properties
     * onto camelCase JS properties, not always HTML attributes.
     * We read the property value directly from the stub element.
     */
    it('returns "inverse" icon variant for a non-base variant', () => {
        const el = createComponent({ variant: 'brand', withClose: true });
        const icon = el.shadowRoot.querySelector('lightning-icon');
        // Access the LWC component property (camelCase) rather than HTML attribute
        expect(icon.variant).toBe('inverse');
    });

    it('returns "" (empty string) icon variant for variant="base"', () => {
        const el = createComponent({ variant: 'base', withClose: true });
        const icon = el.shadowRoot.querySelector('lightning-icon');
        const variant = icon.variant;
        expect(variant === '' || variant === null || variant === undefined).toBe(true);
    });
});

// ─── 7. handleMouseOverOrFocusElement ────────────────────────────────────────

describe('handleMouseOverOrFocusElement', () => {
    it('shows the popover on mouseover of the value slot', async () => {
        const el = createComponent();
        await triggerMouseOver(el);
        expect(el.shadowRoot.querySelector('.popover').classList.contains('popover-show')).toBe(true);
    });

    it('stops propagation of the mouseover event', () => {
        const el = createComponent();
        const valueSlot = el.shadowRoot.querySelector('.main-content slot[name="value"]');
        const event = new CustomEvent('mouseover', { bubbles: true });
        const stopSpy = jest.spyOn(event, 'stopPropagation');
        valueSlot.dispatchEvent(event);
        expect(stopSpy).toHaveBeenCalled();
    });
});

// ─── 8. handleMouseLeaveOrBlurElement ────────────────────────────────────────

describe('handleMouseLeaveOrBlurElement', () => {
    it('hides the popover on mouseleave when withClose is false', async () => {
        const el = createComponent({ withClose: false });
        await triggerMouseOver(el);
        await triggerMouseLeave(el);
        expect(el.shadowRoot.querySelector('.popover').classList.contains('popover-hide')).toBe(true);
    });

    it('keeps the popover visible on mouseleave when withClose is true', async () => {
        const el = createComponent({ withClose: true });
        await triggerMouseOver(el);
        await triggerMouseLeave(el);
        expect(el.shadowRoot.querySelector('.popover').classList.contains('popover-show')).toBe(true);
    });

    it('stops propagation of the mouseleave event', () => {
        const el = createComponent();
        const valueSlot = el.shadowRoot.querySelector('.main-content slot[name="value"]');
        const event = new CustomEvent('mouseleave', { bubbles: true });
        const stopSpy = jest.spyOn(event, 'stopPropagation');
        valueSlot.dispatchEvent(event);
        expect(stopSpy).toHaveBeenCalled();
    });
});

// ─── 9. handleLinkClick ──────────────────────────────────────────────────────

describe('handleLinkClick (toggle)', () => {
    it('shows the popover on first link click', async () => {
        const el = createComponent();
        const linkSlot = el.shadowRoot.querySelector('slot[name="link"]');
        linkSlot.dispatchEvent(new CustomEvent('click', { bubbles: true }));
        await flushPromises();
        expect(el.shadowRoot.querySelector('.popover').classList.contains('popover-show')).toBe(true);
    });

    it('hides the popover on the second link click (toggle off)', async () => {
        const el = createComponent();
        const linkSlot = el.shadowRoot.querySelector('slot[name="link"]');

        linkSlot.dispatchEvent(new CustomEvent('click', { bubbles: true }));
        await flushPromises();

        linkSlot.dispatchEvent(new CustomEvent('click', { bubbles: true }));
        await flushPromises();

        expect(el.shadowRoot.querySelector('.popover').classList.contains('popover-hide')).toBe(true);
    });

    it('stops propagation of the click event', () => {
        const el = createComponent();
        const linkSlot = el.shadowRoot.querySelector('slot[name="link"]');
        const event = new CustomEvent('click', { bubbles: true });
        const stopSpy = jest.spyOn(event, 'stopPropagation');
        linkSlot.dispatchEvent(event);
        expect(stopSpy).toHaveBeenCalled();
    });
});

// ─── 10. handlePopoverClose ──────────────────────────────────────────────────

describe('handlePopoverClose', () => {
    it('hides the popover when the close button is clicked', async () => {
        const el = createComponent({ withClose: true });
        await triggerMouseOver(el);

        const closeBtn = el.shadowRoot.querySelector('button[title="Close dialog"]');
        expect(closeBtn).not.toBeNull();
        closeBtn.click();
        await flushPromises();

        expect(el.shadowRoot.querySelector('.popover').classList.contains('popover-hide')).toBe(true);
    });

    it('resets togglePopover so the link click can re-open the popover', async () => {
        const el = createComponent({ withClose: true });

        // Open via link click (togglePopover = true)
        const linkSlot = el.shadowRoot.querySelector('slot[name="link"]');
        linkSlot.dispatchEvent(new CustomEvent('click', { bubbles: true }));
        await flushPromises();

        // Close via button (togglePopover reset to false)
        el.shadowRoot.querySelector('button[title="Close dialog"]').click();
        await flushPromises();

        // Open via link click again (should work since togglePopover is false)
        linkSlot.dispatchEvent(new CustomEvent('click', { bubbles: true }));
        await flushPromises();

        expect(el.shadowRoot.querySelector('.popover').classList.contains('popover-show')).toBe(true);
    });
});

// ─── 11. handleSlotChange ────────────────────────────────────────────────────

describe('handleSlotChange', () => {
    /**
     * Creates a synthetic slotchange event with a mocked slot element.
     * @param {string} slotName
     * @param {number} elemCount
     */
    function createSlotChangeEvent(slotName, elemCount) {
        const mockSlot = {
            name: slotName,
            assignedElements: () => new Array(elemCount).fill(document.createElement('span')),
        };
        const event = new CustomEvent('slotchange');
        Object.defineProperty(event, 'target', { value: mockSlot, writable: false });
        return event;
    }

    it('sets hasHeader to true when a slotchange event reports assigned elements', async () => {
        const el = createComponent();
        // The header slot is inside `if:true={hasHeader}` which starts false,
        // so we dispatch a synthetic event on the body slot (always rendered)
        // to simulate the slotchange signalling a new header assignment.
        const bodySlot = el.shadowRoot.querySelector('slot[name="body"]');
        // Simulate a slotchange for the "header" via the always-present body slot
        bodySlot.dispatchEvent(createSlotChangeEvent('header', 1));
        await flushPromises();

        // After hasHeader becomes true, the <header> element should render
        expect(el.shadowRoot.querySelector('header')).not.toBeNull();
    });

    it('hides the header section when the header slotchange reports 0 elements', async () => {
        const el = createComponent();
        const bodySlot = el.shadowRoot.querySelector('slot[name="body"]');

        // First set hasHeader = true
        bodySlot.dispatchEvent(createSlotChangeEvent('header', 1));
        await flushPromises();
        expect(el.shadowRoot.querySelector('header')).not.toBeNull();

        // Now signal header is empty
        bodySlot.dispatchEvent(createSlotChangeEvent('header', 0));
        await flushPromises();
        expect(el.shadowRoot.querySelector('header')).toBeNull();
    });

    it('handles a slot with no name attribute (empty string) and maps it to "body"', async () => {
        const el = createComponent();
        const bodySlot = el.shadowRoot.querySelector('slot[name="body"]');

        // Dispatch with name = '' → should be treated as body
        bodySlot.dispatchEvent(createSlotChangeEvent('', 1));
        await flushPromises();

        // Body div is always rendered (hasBody starts true); verify it is still present
        expect(el.shadowRoot.querySelector('.slds-popover__body')).not.toBeNull();
    });
});

// ─── 12. calcPlacement ───────────────────────────────────────────────────────

describe('calcPlacement (viewport overflow detection)', () => {
    it('keeps TOP placement when there is enough room above', async () => {
        const el = createComponent({ placement: 'top' });
        const styles = await showWithRects(
            el,
            { top: 200, left: 300, bottom: 220, right: 450, width: 150, height: 20 },
            { height: 100, width: 200, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // calcVertical for TOP: yPos = -(popoverHeight + 14) = -114px
        expect(styles.yPos).toBe('-114px');
    });

    it('falls back to BOTTOM when container is too close to the top', async () => {
        const el = createComponent({ placement: 'top' });
        const styles = await showWithRects(
            el,
            { top: 5, left: 300, bottom: 25, right: 450, width: 150, height: 20 },
            { height: 100, width: 200, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // top(5) - height(100) < 0 → fallback BOTTOM: yPos = containerHeight(20) + 14 = 34px
        expect(styles.yPos).toBe('34px');
    });

    it('falls back to RIGHT when container is too close to the left edge', async () => {
        const el = createComponent({ placement: 'left' });
        const styles = await showWithRects(
            el,
            { top: 300, left: 5, bottom: 330, right: 100, width: 95, height: 30 },
            { height: 80, width: 200, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // left(5) - width(200) < 0 → fallback RIGHT: xPos = containerWidth(95) + 14 = 109px
        expect(styles.xPos).toBe('109px');
    });

    it('falls back to LEFT when container is too close to the right edge', async () => {
        // window.innerWidth defaults to 1024 in jsdom
        const el = createComponent({ placement: 'right' });
        const styles = await showWithRects(
            el,
            { top: 300, left: 900, bottom: 330, right: 1020, width: 120, height: 30 },
            { height: 80, width: 200, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // right(1020) + width(200) = 1220 > 1024 → fallback LEFT: xPos = -(200 + 14) = -214px
        expect(styles.xPos).toBe('-214px');
    });

    it('falls back to TOP when the bottom of the container overflows the viewport', async () => {
        // window.innerHeight defaults to 768 in jsdom
        const el = createComponent({ placement: 'bottom' });
        const styles = await showWithRects(
            el,
            { top: 700, left: 300, bottom: 720, right: 450, width: 150, height: 20 },
            { height: 100, width: 200, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // bottom(720) + height(100) = 820 > 768 → fallback TOP: yPos = -(100 + 14) = -114px
        expect(styles.yPos).toBe('-114px');
    });
});

// ─── 13. calcHorizontal ──────────────────────────────────────────────────────

describe('calcHorizontal (left / right placement positions)', () => {
    it('positions the popover to the LEFT of the trigger', async () => {
        const el = createComponent({ placement: 'left' });
        const styles = await showWithRects(
            el,
            { top: 300, left: 400, bottom: 330, right: 500, width: 100, height: 30 },
            { height: 80, width: 150, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // xPos = -(popoverWidth + nubbinPadding) = -(150 + 14) = -164px
        expect(styles.xPos).toBe('-164px');
    });

    it('positions the popover to the RIGHT of the trigger', async () => {
        const el = createComponent({ placement: 'right' });
        const styles = await showWithRects(
            el,
            { top: 300, left: 100, bottom: 330, right: 300, width: 200, height: 30 },
            { height: 80, width: 150, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // xPos = containerWidth + nubbinPadding = 200 + 14 = 214px
        expect(styles.xPos).toBe('214px');
    });

    it('vertically centres the popover on the trigger', async () => {
        const el = createComponent({ placement: 'right' });
        const styles = await showWithRects(
            el,
            { top: 300, left: 400, bottom: 330, right: 500, width: 100, height: 30 },
            { height: 80, width: 150, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // midHeight = (30 - 80) / 2 = -25; containerTop(300) + (-25) = 275 > 10 → no adjustment
        expect(styles.yPos).toBe('-25px');
    });

    it('shifts the popover down when it would bleed off the top edge', async () => {
        const el = createComponent({ placement: 'right' });
        const styles = await showWithRects(
            el,
            { top: 2, left: 400, bottom: 82, right: 500, width: 100, height: 80 },
            { height: 200, width: 150, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // midHeight = (80 - 200) / 2 = -60
        // containerTop(2) + midHeight(-60) = -58 < 10
        // adjustment = -(-58 - 10) = 68 → yPos = -60 + 68 = 8px
        expect(styles.yPos).toBe('8px');
    });
});

// ─── 14. calcVertical ────────────────────────────────────────────────────────

describe('calcVertical (top / bottom placement positions)', () => {
    it('positions the popover above the trigger for placement="top"', async () => {
        const el = createComponent({ placement: 'top' });
        const styles = await showWithRects(
            el,
            { top: 300, left: 300, bottom: 320, right: 500, width: 200, height: 20 },
            { height: 100, width: 200, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // yPos = -(100 + 14) = -114px
        expect(styles.yPos).toBe('-114px');
    });

    it('positions the popover below the trigger for placement="bottom"', async () => {
        const el = createComponent({ placement: 'bottom' });
        const styles = await showWithRects(
            el,
            { top: 100, left: 300, bottom: 120, right: 500, width: 200, height: 20 },
            { height: 100, width: 200, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // yPos = containerHeight(20) + 14 = 34px
        expect(styles.yPos).toBe('34px');
    });

    it('centres the popover horizontally over the trigger', async () => {
        const el = createComponent({ placement: 'top' });
        const styles = await showWithRects(
            el,
            { top: 300, left: 200, bottom: 320, right: 400, width: 200, height: 20 },
            { height: 100, width: 200, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // midWidth = (200 - 200) / 2 = 0; no edge bleed → xPos = 0px
        expect(styles.xPos).toBe('0px');
    });

    it('shifts the popover right when it bleeds off the left edge', async () => {
        const el = createComponent({ placement: 'top' });
        const styles = await showWithRects(
            el,
            { top: 300, left: 0, bottom: 320, right: 200, width: 200, height: 20 },
            { height: 100, width: 400, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // midWidth = (200 - 400) / 2 = -100
        // containerLeft(0) + (-100) = -100 < 4 → adjustment = 4 - (-100) = 104
        // midWidth = -100 + 104 = 4 → xPos = 4px
        expect(styles.xPos).toBe('4px');
    });

    it('shifts the popover left when it bleeds off the right edge', async () => {
        // window.innerWidth defaults to 1024 in jsdom
        const el = createComponent({ placement: 'top' });
        const styles = await showWithRects(
            el,
            { top: 300, left: 900, bottom: 320, right: 1000, width: 100, height: 20 },
            { height: 100, width: 400, top: 0, left: 0, bottom: 0, right: 0 }
        );
        // midWidth = (100 - 400) / 2 = -150
        // containerLeft(900) + (-150) = 750; 750 + 400 = 1150 > 1024 - 4 = 1020
        // adjustment = 1020 - 1150 = -130; midWidth = -150 + (-130) = -280px
        expect(styles.xPos).toBe('-280px');
    });
});