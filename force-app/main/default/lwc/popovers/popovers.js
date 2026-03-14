/**
 * @file popovers.js
 * @description Core JavaScript controller for the Custom Popover LWC.
 * Handles state, visibility, event dispatching, and dynamic coordinate positioning.
 */

import { LightningElement, api } from 'lwc';
import { 
    popoverClass,  
    popoverSectionClass, 
    nubbinAdjustmentClass, 
    nubbinAdjustmentVars,
    calcFunction
} from './helper';
import { PLACEMENT } from './constants';

/**
 * @class Popovers
 * @extends LightningElement
 * @description A responsive, SLDS-compliant popover component that dynamically anchors to a trigger slot.
 */
export default class Popovers extends LightningElement {

    /**
     * @api {string} size
     * @description Popover dimension size ('small', 'medium', 'large').
     * @default 'medium'
     */
    @api size = 'medium';

    /**
     * @api {string} variant
     * @description SLDS visual variant ('base', 'warning', 'error', 'brand', 'success', 'walk', 'walkalt').
     * @default 'base'
     */
    @api variant = 'base';

    /**
     * @api {string} placement
     * @description Preferred directional placement ('top', 'bottom', 'left', 'right').
     * @default 'top'
     */
    @api placement = PLACEMENT.TOP;

    /**
     * @api {boolean} withClose
     * @description Renders a manual close button and suppresses the mouseleave auto-close behavior.
     * @default false
     */
    @api withClose = false;
 
    /** @type {boolean} visibility state */
    isVisible = false;
    /** @type {boolean} toggle reference for link click activations */
    togglePopover = false;
    
    popoverXPos = 0;
    popoverYPos = 0;
    adjustment = 0;
    currentPlacement = '';
    activeNubbinClass = '';

    /** @type {boolean} slot availability flags */
    hasHeader = false;
    hasBody = true;
    hasFooter = true;

    /** 
     * @type {string}
     * @description Unique identifier for DOM class separation. 
     */
    uniqueId = `popover-${Math.random().toString(36).substring(2, 9)}`;

    /**
     * @returns {string} The computed classes for the absolute-positioned root container.
     */
    get popoverContainerClass() {
        return `popover_container ${this.uniqueId} ${this.activeNubbinClass}`;
    } 

    /**
     * @returns {string} Visibility classes applied to the popover DOM node.
     */
    get popoverClass() {
        return popoverClass(this.isVisible);
    }

    /**
     * @returns {string} Assembled SLDS styling classes for the popover section.
     */
    get popoverSectionClass() { 
        return popoverSectionClass(this);
    }

    /**
     * @returns {string} The variant string for the dismiss icon, if applicable.
     */
    get closeIconVariant() { 
        return this.variant && this.variant !== 'base' ? "inverse" : "";
    }

    /**
     * Intercepts slotchange events to toggle header/footer rendering regions dynamically.
     * @param {Event} event - The DOM slotchange event.
     */
    handleSlotChange(event) {
        const slot = event.target;
        const slotName = slot.name || 'body';
        const hasValue = slot.assignedElements().length > 0;
        
        if (slotName === 'header') this.hasHeader = hasValue;
        if (slotName === 'body') this.hasBody = hasValue;
        if (slotName === 'footer') this.hasFooter = hasValue;
    }

    /**
     * Handles trigger mouseover events.
     * @param {Event} event
     */
    handleMouseOverOrFocusElement(event) {
        event.stopPropagation();
        this.handlePopoverShow();
    }
  
    /**
     * Handles trigger mouseleave events. Overridden by `withClose`.
     * @param {Event} event
     */
    handleMouseLeaveOrBlurElement(event) {
        event.stopPropagation();
        this.togglePopover = false;
        this.handlePopoverHide();
    }

    /**
     * Handles link clicks for toggle-based visibility.
     * @param {Event} event
     */
    handleLinkClick(event) {
        event.stopPropagation();
        this.togglePopover = !this.togglePopover; 
        if (this.togglePopover) {
            this.handlePopoverShow();
        } else {
            this.handlePopoverHide();
        }
    }

    /**
     * Forces immediate dismissal of the popover.
     */
    handlePopoverClose() {
        this.isVisible = false;
        this.togglePopover = false;
    }

    /**
     * Activates visibility and issues a dimensional reflow coordinate request.
     */
    handlePopoverShow() {
        this.isVisible = true;
        requestAnimationFrame(() => {
            this.calculatePopoverPosition();
        });
    }

    /**
     * Deactivates visibility if `withClose` is not enabled.
     */
    handlePopoverHide() {
        if (!this.withClose) {
            this.isVisible = false;
        }
    }
  
    /**
     * Resolves layout coordinates depending on bounds, viewport edges, and placement.
     * Populates active CSS custom properties affecting `.popover` styles.
     */
    calculatePopoverPosition() {
        const popover = this.template.querySelector(".popover");
        const container = this.template.querySelector(".popover_container");
        
        if (!popover || !container) return;

        const containerRect = container.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();

        const placement = this.calcPlacement(containerRect, popoverRect, this.placement);
        this.currentPlacement = placement;

        const calcMethod = calcFunction(placement);
        if (!calcMethod) return;

        const { popoverXPos, popoverYPos, adjustment } = this[calcMethod](containerRect, popoverRect, placement) ?? {};

        popover.style.setProperty('--popover-x-pos', `${popoverXPos}px`);
        popover.style.setProperty('--popover-y-pos', `${popoverYPos}px`);
        
        if (adjustment && placement) {
            popover.style.setProperty(nubbinAdjustmentVars(placement), `${adjustment}px`);
        }

        this.activeNubbinClass = adjustment ? nubbinAdjustmentClass(placement) : '';
    }

    /**
     * Evaluates viewport limits to pivot the requested placement radially if necessary.
     * @param {DOMRect} containerRect
     * @param {DOMRect} popoverRect
     * @param {string} preferredPlacement
     * @returns {string} Calculated viable placement.
     */
    calcPlacement(containerRect, popoverRect, preferredPlacement) {
        const { top, left, bottom, right } = containerRect;
        const { width, height } = popoverRect;

        if (preferredPlacement === PLACEMENT.TOP && top - height < 0) return PLACEMENT.BOTTOM; 
        if (preferredPlacement === PLACEMENT.LEFT && left - width < 0) return PLACEMENT.RIGHT; 
        if (preferredPlacement === PLACEMENT.RIGHT && right + width > window.innerWidth) return PLACEMENT.LEFT; 
        if (preferredPlacement === PLACEMENT.BOTTOM && bottom + height > window.innerHeight) return PLACEMENT.TOP;

        return preferredPlacement;
    }

    /**
     * Executes mathematical offset resolution for Left/Right anchored popovers.
     * @param {DOMRect} containerRect
     * @param {DOMRect} popoverRect
     * @param {string} placement
     * @returns {Object} Computed offset matrix payload.
     */
    calcHorizontal(containerRect, popoverRect, placement) {
        const { width: containerWidth, height: containerHeight, top: containerTop } = containerRect;
        const { height: popoverHeight, width: popoverWidth } = popoverRect;
        const nubbinPadding = 14;

        const midHeight = (containerHeight - popoverHeight) / 2;
        const xPos = placement === PLACEMENT.LEFT ? -(popoverWidth + nubbinPadding) : (containerWidth + nubbinPadding);
        
        let adjustment = 0;
        if (containerTop + midHeight < 10) {
            adjustment = -(containerTop + midHeight - 10);
        } else if (containerTop + midHeight + popoverHeight > window.innerHeight - 10) {
            adjustment = window.innerHeight - 10 - (containerTop + midHeight + popoverHeight);
        }

        return { 
            popoverXPos: xPos, 
            popoverYPos: midHeight + adjustment, 
            adjustment: -adjustment 
        };
    }

    /**
     * Executes mathematical offset resolution for Top/Bottom anchored popovers.
     * @param {DOMRect} containerRect
     * @param {DOMRect} popoverRect
     * @param {string} placement
     * @returns {Object} Computed offset matrix payload.
     */
    calcVertical(containerRect, popoverRect, placement) {
        const { width: containerWidth, height: containerHeight, left: containerLeft } = containerRect;
        const { height: popoverHeight, width: popoverWidth } = popoverRect;
        const nubbinPadding = 14;

        const yPos = placement === PLACEMENT.BOTTOM ? (containerHeight + nubbinPadding) : -(popoverHeight + nubbinPadding);

        let midWidth = (containerWidth - popoverWidth) / 2;
        let adjustment = 0;

        if (containerLeft + midWidth < 4) {
            adjustment = 4 - (containerLeft + midWidth);
            midWidth += adjustment;
        } else if (containerLeft + midWidth + popoverWidth > window.innerWidth - 4) {
            adjustment = (window.innerWidth - 4) - (containerLeft + midWidth + popoverWidth);
            midWidth += adjustment;
        }

        return { 
            popoverXPos: midWidth, 
            popoverYPos: yPos, 
            adjustment: -adjustment 
        };
    }
}