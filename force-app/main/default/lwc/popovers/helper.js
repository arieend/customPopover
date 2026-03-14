/**
 * @file helper.js
 * @description Utility functions for generating popover CSS classes and resolving coordinate computations.
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
 * Retrieves the SLDS variant class.
 * @param {string} variant - The variant identifier.
 * @returns {string} The corresponding SLDS class or empty string.
 */
const getVariant = (variant) => variant ? (VARIANTS[variant.toUpperCase()] ?? "") : "";

/**
 * Retrieves the SLDS size class.
 * @param {string} size - The size identifier.
 * @returns {string} The corresponding SLDS size class.
 */
const getPopoverSize = (size) => size ? (POPOVER_SIZES[size.toUpperCase()] ?? POPOVER_SIZES.MEDIUM) : POPOVER_SIZES.MEDIUM; 

/**
 * Retrieves the SLDS nubbin placement class.
 * @param {string} placement - The placement identifier.
 * @returns {string} The corresponding SLDS nubbin class.
 */
const getNubbinPlacement = (placement) => placement ? (NUBBIN_PLACEMENT[placement.toUpperCase()] ?? NUBBIN_PLACEMENT.DEFAULT) : NUBBIN_PLACEMENT.DEFAULT;

/**
 * Retrieves the custom adjustment class for the nubbin element.
 * @param {string} placement - The placement identifier.
 * @returns {string} The custom nubbin adjustment class.
 */
const nubbinAdjustmentClass = (placement) => placement ? (NUBBIN_ADJUSTMENT[placement.toUpperCase()] ?? '') : '';

/**
 * Retrieves the CSS custom property variable for nubbin adjustment.
 * @param {string} placement - The placement identifier.
 * @returns {string} The CSS custom property string.
 */
const nubbinAdjustmentVars = (placement) => placement ? (NUBBIN_ADJUSTMENT_VARS[placement.toUpperCase()] ?? '') : '';

/**
 * Generates the visibility base class string for the popover component.
 * @param {boolean} isShow - Indicates if the popover is currently visible.
 * @returns {string} The formatted visibility class string.
 */
const popoverClass = (isShow = false) => `popover ${POPOVER_TOGGLE[isShow] ?? ''}`; 

/**
 * Constructs the aggregated SLDS class string for the popover section.
 * @param {Object} config - Configuration object.
 * @param {string} config.placement - Alignment placement.
 * @param {string} config.variant - Styling variant.
 * @param {string} config.size - Dimensional size.
 * @returns {string} Fully qualified SLDS class string.
 */
const popoverSectionClass = ({placement, variant, size}) => 
    `${SLDS_POPOVER_CLASS} ${getNubbinPlacement(placement)} ${getVariant(variant)} ${getPopoverSize(size)}`;

/**
 * Resolves the positioning calculation method name required for a specific placement.
 * @param {string} placement - The placement identifier.
 * @returns {string|undefined} Method name or undefined.
 */
const calcFunction = (placement) => placement ? CALC_FUNCTION[placement.toUpperCase()] : undefined;

export { 
    popoverClass,  
    popoverSectionClass,  
    nubbinAdjustmentClass, 
    nubbinAdjustmentVars,
    calcFunction,
};