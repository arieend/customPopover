/**
 * SLDS base class for popovers
 * @type {string}
 */
const SLDS_POPOVER_CLASS = "slds-popover";

/**
 * Supported size variants
 * @type {Object.<string, string>}
 */
const POPOVER_SIZES = {
  SMALL  : "slds-popover_small",
  MEDIUM : "slds-popover_medium",
  LARGE  : "slds-popover_large"
};

/**
 * Supported styling variants
 * @type {Object.<string, string>}
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
 * Standard placement options
 * @type {Object.<string, string>}
 */
const PLACEMENT = {
    AUTO   : "auto",
    TOP    : "top",
    LEFT   : "left",
    RIGHT  : "right",
    BOTTOM : "bottom"
};

/**
 * Mapping of nubbin directions relative to popover placement
 * @type {Object.<string, string>}
 */
const RELATIONS = {
    TOP    : "bottom",
    LEFT   : "right",
    RIGHT  : "left",
    BOTTOM : "top"
};

/**
 * Nubbin SLDS classes based on placement
 * @type {Object.<string, string>}
 */
const NUBBIN_PLACEMENT = {
    TOP     : `slds-nubbin_${RELATIONS.TOP}`,
    RIGHT   : `slds-nubbin_${RELATIONS.RIGHT}`,
    LEFT    : `slds-nubbin_${RELATIONS.LEFT}`,
    BOTTOM  : `slds-nubbin_${RELATIONS.BOTTOM}`,
    DEFAULT : `slds-nubbin_${RELATIONS.TOP}`
};

/**
 * Custom classes for nubbin offset adjustments
 * @type {Object.<string, string>}
 */
const NUBBIN_ADJUSTMENT = {
    TOP     : `nubbin-adjustment_${RELATIONS.TOP}`,
    RIGHT   : `nubbin-adjustment_${RELATIONS.RIGHT}`,
    LEFT    : `nubbin-adjustment_${RELATIONS.LEFT}`,
    BOTTOM  : `nubbin-adjustment_${RELATIONS.BOTTOM}`
};

/**
 * CSS Custom Property names for nubbin positioning
 * @type {Object.<string, string>}
 */
const NUBBIN_ADJUSTMENT_VARS = {
    TOP     : `--adjustment-${RELATIONS.TOP}`,
    RIGHT   : `--adjustment-${RELATIONS.RIGHT}`,
    LEFT    : `--adjustment-${RELATIONS.LEFT}`,
    BOTTOM  : `--adjustment-${RELATIONS.BOTTOM}`
};

/**
 * Visibility state classes
 * @type {Object.<string, string>}
 */
const POPOVER_TOGGLE = { 
    true: 'popover-show',
    false: 'popover-hide'
}

/**
 * Mapping of placements to their respective calculation methods
 * @type {Object.<string, string>}
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