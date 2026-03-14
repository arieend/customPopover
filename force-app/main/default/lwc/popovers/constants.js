/**
 * @file constants.js
 * @description Constant definitions for SLDS classes, attributes, and calculation logic.
 */

/**
 * @constant {string} SLDS_POPOVER_CLASS - Base SLDS class for the popover element.
 */
const SLDS_POPOVER_CLASS = "slds-popover";

/**
 * @constant {Object.<string, string>} POPOVER_SIZES - Supported size variants.
 */
const POPOVER_SIZES = {
    SMALL  : "slds-popover_small",
    MEDIUM : "slds-popover_medium",
    LARGE  : "slds-popover_large"
};

/**
 * @constant {Object.<string, string>} VARIANTS - Supported styling variants.
 */
const VARIANTS = {
    WARNING : "slds-popover_warning",
    ERROR   : "slds-popover_error",
    BRAND   : "slds-popover_brand",
    SUCCESS : "slds-popover_success",
    WALK    : "slds-popover_walkthrough",
    WALKALT : "slds-popover_walkthrough slds-popover_walkthrough-alt" 
};

/**
 * @constant {Object.<string, string>} PLACEMENT - Standard placement options.
 */
const PLACEMENT = {
    AUTO   : "auto",
    TOP    : "top",
    LEFT   : "left",
    RIGHT  : "right",
    BOTTOM : "bottom"
};

/**
 * @constant {Object.<string, string>} RELATIONS - Mapping of nubbin directions relative to popover placement.
 */
const RELATIONS = {
    TOP    : "bottom",
    LEFT   : "right",
    RIGHT  : "left",
    BOTTOM : "top"
};

/**
 * @constant {Object.<string, string>} NUBBIN_PLACEMENT - SLDS nubbin classes based on placement.
 */
const NUBBIN_PLACEMENT = {
    TOP     : `slds-nubbin_${RELATIONS.TOP}`,
    RIGHT   : `slds-nubbin_${RELATIONS.RIGHT}`,
    LEFT    : `slds-nubbin_${RELATIONS.LEFT}`,
    BOTTOM  : `slds-nubbin_${RELATIONS.BOTTOM}`,
    DEFAULT : `slds-nubbin_${RELATIONS.TOP}`
};

/**
 * @constant {Object.<string, string>} NUBBIN_ADJUSTMENT - Custom classes for nubbin offset adjustments.
 */
const NUBBIN_ADJUSTMENT = {
    TOP     : `nubbin-adjustment_${RELATIONS.TOP}`,
    RIGHT   : `nubbin-adjustment_${RELATIONS.RIGHT}`,
    LEFT    : `nubbin-adjustment_${RELATIONS.LEFT}`,
    BOTTOM  : `nubbin-adjustment_${RELATIONS.BOTTOM}`
};

/**
 * @constant {Object.<string, string>} NUBBIN_ADJUSTMENT_VARS - CSS custom properties for nubbin positioning.
 */
const NUBBIN_ADJUSTMENT_VARS = {
    TOP     : `--adjustment-${RELATIONS.TOP}`,
    RIGHT   : `--adjustment-${RELATIONS.RIGHT}`,
    LEFT    : `--adjustment-${RELATIONS.LEFT}`,
    BOTTOM  : `--adjustment-${RELATIONS.BOTTOM}`
};

/**
 * @constant {Object.<string, string>} POPOVER_TOGGLE - Visibility state classes.
 */
const POPOVER_TOGGLE = { 
    true: 'popover-show',
    false: 'popover-hide'
};

/**
 * @constant {Object.<string, string>} CALC_FUNCTION - Mapping of placements to coordinate calculation functions.
 */
const CALC_FUNCTION = {
    TOP    : 'calcVertical',
    RIGHT  : 'calcHorizontal',
    LEFT   : 'calcHorizontal',
    BOTTOM : 'calcVertical',
};

export { 
    SLDS_POPOVER_CLASS, 
    POPOVER_SIZES, 
    VARIANTS, 
    PLACEMENT,
    NUBBIN_PLACEMENT, 
    NUBBIN_ADJUSTMENT,
    NUBBIN_ADJUSTMENT_VARS,
    POPOVER_TOGGLE, 
    CALC_FUNCTION
};