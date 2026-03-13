/**
 * Custom Popover Component
 * Provides a responsive, SLDS-compliant popover that anchors to a trigger element.
 * 
 * @alias Popovers
 * @extends LightningElement
 * @hideconstructor
 */
import { LightningElement, api } from 'lwc';
import { 
    popoverClass,  
    popoverSectionClass, 
    nubbinAdjustmentClass, 
    nubbinAdjustmentVars,
    calcFunction
} from './helper';
import { PLACEMENT } from './constants'

export default class Popovers extends LightningElement {

    /**
     * Size of the popover (small, medium, large)
     * @type {string}
     * @default 'medium'
     */
    @api size = 'medium';

    /**
     * SLDS Variant (base, warning, error, brand, success, walk, walkalt)
     * @type {string}
     * @default 'base'
     */
    @api variant = 'base';

    /**
     * Preferred placement (top, bottom, left, right)
     * @type {string}
     * @default 'top'
     */
    @api placement = PLACEMENT.TOP;

    /**
     * If true, shows close button and stays open until manually closed
     * @type {boolean}
     * @default false
     */
    @api withClose = false;
 
    // Internal state
    isVisible = false;
    togglePopover = false;
    popoverXPos = 0;
    popoverYPos = 0;
    adjustment = 0;
    currentPlacement = '';
    activeNubbinClass = '';

    // Slot visibility flags
    hasHeader = false;
    hasBody = true;
    hasFooter = true;

    /**
     * Unique identifier for the popover instance
     * @type {string}
     */
    uniqueId = `popover-${Math.random().toString(36).substring(2, 9)}`;

    /**
     * Computed classes for the root container
     */
    get popoverContainerClass (){
        return `popover_container ${this.uniqueId} ${this.activeNubbinClass}`;
    } 

    /**
     * Computed visibility classes for the popover
     */
    get popoverClass() {
        return popoverClass(this.isVisible);
    }

    /**
     * Computed SLDS classes for the popover section
     */
    get popoverSectionClass() { 
        return popoverSectionClass(this);
    };

    /**
     * Returns the icon variant based on the component variant
     */
    get closeIconVariant () { 
        return this.variant && this.variant !== 'base' ? "inverse" : "";
    };

    /**
     * Handles dynamic visibility of slots
     * @param {Event} event 
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
     * Shows popover on mouse over
     * @param {Event} event 
     */
    handleMouseOverOrFocusElement(event) {
        event.stopPropagation();
        this.handlePopoverShow();
    }
  
    /**
     * Hides popover on mouse leave (if not in 'withClose' mode)
     * @param {Event} event 
     */
    handleMouseLeaveOrBlurElement(event) {
        event.stopPropagation();
        this.togglePopover = false;
        this.handlePopoverHide();
    }

    /**
     * Toggles popover visibility on link click
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
     * Manually closes the popover
     */
    handlePopoverClose() {
        this.isVisible = false;
        this.togglePopover = false;
    }

    /**
     * Logic to reveal the popover and trigger coordinate calculation
     */
    handlePopoverShow() {
        this.isVisible = true;
        
        // Ensure DOM is rendered before calculating dimensions
        requestAnimationFrame(() => {
            this.calculatePopoverPosition();
        });
    }

    /**
     * Logic to hide the popover
     */
    handlePopoverHide() {
        if (!this.withClose) {
            this.isVisible = false;
        }
    }
  
    /**
     * Primary logic for coordinate calculation and screen overflow handling.
     * Applies coordinates via CSS Custom Properties.
     */
    calculatePopoverPosition() {
        const popover = this.template.querySelector(".popover");
        const container = this.template.querySelector(".popover_container");
        
        if (!popover || !container) return;

        const containerRect = container.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();

        // 1. Determine best placement based on viewport
        const placement = this.calcPlacement(containerRect, popoverRect, this.placement);
        this.currentPlacement = placement;

        // 2. Run calculation for the specific placement axis
        const calcMethod = calcFunction(placement);
        const { popoverXPos, popoverYPos, adjustment } = this[calcMethod](containerRect, popoverRect, placement) ?? {};

        // 3. Apply coordinates to local CSS variables
        popover.style.setProperty('--popover-x-pos', `${popoverXPos}px`);
        popover.style.setProperty('--popover-y-pos', `${popoverYPos}px`);
        
        // 4. Handle nubbin offset if the popover was shifted
        if (adjustment && placement) {
            popover.style.setProperty(nubbinAdjustmentVars(placement), `${adjustment}px`);
        }

        this.activeNubbinClass = adjustment ? nubbinAdjustmentClass(placement) : '';
    }

    /**
     * Detects if preferred placement causes viewport overflow and returns alternative
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
     * Calculation logic for Left/Right placement
     */
    calcHorizontal(containerRect, popoverRect, placement) {
        const { width: containerWidth, height: containerHeight, top: containerTop } = containerRect;
        const { height: popoverHeight, width: popoverWidth } = popoverRect;
        const nubbinPadding = 14;

        const midHeight = (containerHeight - popoverHeight) / 2;
        const xPos = placement === PLACEMENT.LEFT ? -(popoverWidth + nubbinPadding) : (containerWidth + nubbinPadding);
        
        let adjustment = 0;
        // Shift popover vertically if it bleeds off the top or bottom edge
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
     * Calculation logic for Top/Bottom placement
     */
    calcVertical(containerRect, popoverRect, placement) {
        const { width: containerWidth, height: containerHeight, left: containerLeft, right: containerRight } = containerRect;
        const { height: popoverHeight, width: popoverWidth } = popoverRect;
        const nubbinPadding = 14;

        const yPos = placement === PLACEMENT.BOTTOM ? (containerHeight + nubbinPadding) : -(popoverHeight + nubbinPadding);

        let midWidth = (containerWidth - popoverWidth) / 2;
        let adjustment = 0;

        // Shift popover horizontally if it bleeds off the left or right edge
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