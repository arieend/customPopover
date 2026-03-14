/**
 * @file helper.test.js
 * @description Comprehensive unit tests for helper.js utility functions.
 *
 * Covers:
 *  - popoverClass
 *  - popoverSectionClass
 *  - nubbinAdjustmentClass
 *  - nubbinAdjustmentVars
 *  - calcFunction
 */

import {
    popoverClass,
    popoverSectionClass,
    nubbinAdjustmentClass,
    nubbinAdjustmentVars,
    calcFunction,
} from '../helper';

// ─── popoverClass ────────────────────────────────────────────────────────────

describe('popoverClass', () => {
    it('returns "popover popover-show" when isShow is true', () => {
        expect(popoverClass(true)).toBe('popover popover-show');
    });

    it('returns "popover popover-hide" when isShow is false', () => {
        expect(popoverClass(false)).toBe('popover popover-hide');
    });

    it('returns "popover popover-hide" when called with no arguments (defaults to false)', () => {
        expect(popoverClass()).toBe('popover popover-hide');
    });
});

// ─── popoverSectionClass ─────────────────────────────────────────────────────

describe('popoverSectionClass', () => {
    it('always includes the SLDS base popover class', () => {
        const result = popoverSectionClass({ placement: 'top', variant: 'base', size: 'medium' });
        expect(result).toContain('slds-popover');
    });

    it('builds a complete class string for top / brand / large', () => {
        const result = popoverSectionClass({ placement: 'top', variant: 'brand', size: 'large' });
        expect(result).toContain('slds-nubbin_bottom');   // top placement → nubbin sits on bottom
        expect(result).toContain('slds-popover_brand');
        expect(result).toContain('slds-popover_large');
    });

    it('applies correct nubbin class for "left" placement (nubbin on right)', () => {
        const result = popoverSectionClass({ placement: 'left', variant: 'base', size: 'medium' });
        expect(result).toContain('slds-nubbin_right');
    });

    it('applies correct nubbin class for "right" placement (nubbin on left)', () => {
        const result = popoverSectionClass({ placement: 'right', variant: 'base', size: 'medium' });
        expect(result).toContain('slds-nubbin_left');
    });

    it('applies correct nubbin class for "bottom" placement (nubbin on top)', () => {
        const result = popoverSectionClass({ placement: 'bottom', variant: 'base', size: 'medium' });
        expect(result).toContain('slds-nubbin_top');
    });

    it('uses the default nubbin class for an unknown placement', () => {
        const result = popoverSectionClass({ placement: 'diagonal', variant: 'base', size: 'medium' });
        // DEFAULT falls back to slds-nubbin_bottom
        expect(result).toContain('slds-nubbin_bottom');
    });

    it('defaults to slds-popover_medium when size is not provided', () => {
        const result = popoverSectionClass({ placement: 'top', variant: 'base' });
        expect(result).toContain('slds-popover_medium');
    });

    it('does NOT include a variant class for "base" (not in the VARIANTS map)', () => {
        const result = popoverSectionClass({ placement: 'top', variant: 'base', size: 'medium' });
        expect(result).not.toContain('slds-popover_base');
    });

    it.each([
        ['warning', 'slds-popover_warning'],
        ['error',   'slds-popover_error'],
        ['brand',   'slds-popover_brand'],
        ['success', 'slds-popover_success'],
        ['walk',    'slds-popover_walkthrough'],
    ])('applies variant class "%s" → "%s"', (variant, expectedClass) => {
        const result = popoverSectionClass({ placement: 'top', variant, size: 'medium' });
        expect(result).toContain(expectedClass);
    });

    it('applies both walkthrough classes for "walkalt" variant', () => {
        const result = popoverSectionClass({ placement: 'top', variant: 'walkalt', size: 'medium' });
        expect(result).toContain('slds-popover_walkthrough');
        expect(result).toContain('slds-popover_walkthrough-alt');
    });

    it('is case-insensitive for placement, variant, and size', () => {
        const lower = popoverSectionClass({ placement: 'top',  variant: 'brand', size: 'large' });
        const upper = popoverSectionClass({ placement: 'TOP',  variant: 'BRAND', size: 'LARGE' });
        expect(lower).toBe(upper);
    });
});

// ─── nubbinAdjustmentClass ───────────────────────────────────────────────────

describe('nubbinAdjustmentClass', () => {
    it.each([
        ['top',    'nubbin-adjustment_bottom'],
        ['right',  'nubbin-adjustment_left'],
        ['left',   'nubbin-adjustment_right'],
        ['bottom', 'nubbin-adjustment_top'],
    ])('returns "%s" for placement "%s"', (placement, expected) => {
        expect(nubbinAdjustmentClass(placement)).toBe(expected);
    });

    it('returns an empty string for an unknown placement', () => {
        expect(nubbinAdjustmentClass('diagonal')).toBe('');
    });

    it('returns an empty string when called with no arguments', () => {
        expect(nubbinAdjustmentClass()).toBe('');
    });

    it('returns an empty string for null', () => {
        expect(nubbinAdjustmentClass(null)).toBe('');
    });

    it('returns an empty string for undefined', () => {
        expect(nubbinAdjustmentClass(undefined)).toBe('');
    });
});

// ─── nubbinAdjustmentVars ────────────────────────────────────────────────────

describe('nubbinAdjustmentVars', () => {
    it.each([
        ['top',    '--adjustment-bottom'],
        ['right',  '--adjustment-left'],
        ['left',   '--adjustment-right'],
        ['bottom', '--adjustment-top'],
    ])('returns "%s" for placement "%s"', (placement, expected) => {
        expect(nubbinAdjustmentVars(placement)).toBe(expected);
    });

    it('returns an empty string for an unknown placement', () => {
        expect(nubbinAdjustmentVars('center')).toBe('');
    });

    it('returns an empty string when called with no arguments', () => {
        expect(nubbinAdjustmentVars()).toBe('');
    });

    it('returns an empty string for null', () => {
        expect(nubbinAdjustmentVars(null)).toBe('');
    });
});

// ─── calcFunction ─────────────────────────────────────────────────────────────

describe('calcFunction', () => {
    it.each([
        ['top',    'calcVertical'],
        ['bottom', 'calcVertical'],
        ['left',   'calcHorizontal'],
        ['right',  'calcHorizontal'],
    ])('returns "%s" for placement "%s"', (placement, expected) => {
        expect(calcFunction(placement)).toBe(expected);
    });

    it('returns undefined for an unknown placement', () => {
        expect(calcFunction('auto')).toBeUndefined();
    });

    it('returns undefined when called with no arguments', () => {
        expect(calcFunction()).toBeUndefined();
    });

    it('returns undefined for null', () => {
        expect(calcFunction(null)).toBeUndefined();
    });

    it('works with upper-cased placement strings', () => {
        expect(calcFunction('TOP')).toBe('calcVertical');
        expect(calcFunction('LEFT')).toBe('calcHorizontal');
    });
});
