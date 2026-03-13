/**
 * Utility functions for popover class and coordinate calculations
 */
import {  
    SLDS_POPOVER_CLASS, 
    POPOVER_SIZES, 
    VARIANTS, 
    NUBBIN_PLACEMENT, 
    NUBBIN_ADJUSTMENT, 
    NUBBIN_ADJUSTMENT_VARS, 
    POPOVER_TOGGLE,
    CALC_FUNCTION
} from './constants'

/**
 * Returns the SLDS variant class
 * @param {string} variant 
 * @returns {string}
 */
const getVariant = (variant) => variant ? (VARIANTS[variant.toUpperCase()] ?? "") : "";

/**
 * Returns the SLDS size class
 * @param {string} size 
 * @returns {string}
 */
const getPopoverSize = (size) => size ? (POPOVER_SIZES[size.toUpperCase()] ?? POPOVER_SIZES.MEDIUM) : POPOVER_SIZES.MEDIUM; 

/**
 * Returns the SLDS nubbin placement class
 * @param {string} placement 
 * @returns {string}
 */
const getNubbinPlacement = (placement) => placement ? (NUBBIN_PLACEMENT[placement.toUpperCase()] ?? NUBBIN_PLACEMENT.DEFAULT) : NUBBIN_PLACEMENT.DEFAULT;

/**
 * Returns the custom adjustment class for the nubbin
 * @param {string} placement 
 * @returns {string}
 */
const nubbinAdjustmentClass = (placement) => placement ? (NUBBIN_ADJUSTMENT[placement.toUpperCase()] ?? '') : '';

/**
 * Returns the CSS variable name for nubbin adjustment
 * @param {string} placement 
 * @returns {string}
 */
const nubbinAdjustmentVars = (placement) => placement ? (NUBBIN_ADJUSTMENT_VARS[placement.toUpperCase()] ?? '') : '';

/**
 * Returns the combined base classes for the popover
 * @param {boolean} isShow 
 * @returns {string}
 */
const popoverClass = ( isShow = false ) => `popover ${POPOVER_TOGGLE[isShow] ?? ''}`; 

/**
 * Returns the full section class string including variant, size, and nubbin
 * @param {Object} config
 * @returns {string}
 */
const popoverSectionClass = ({placement, variant, size}) => 
    `${SLDS_POPOVER_CLASS} ${getNubbinPlacement(placement)} ${getVariant(variant)} ${getPopoverSize(size)}`;

/**
 * Resolves the calculation method name for a given placement
 * @param {string} placement 
 * @returns {string|undefined}
 */
const calcFunction = (placement) => placement ? CALC_FUNCTION[placement.toUpperCase()] : undefined;

export { 
    popoverClass,  
    popoverSectionClass,  
    nubbinAdjustmentClass, 
    nubbinAdjustmentVars,
    calcFunction,
}