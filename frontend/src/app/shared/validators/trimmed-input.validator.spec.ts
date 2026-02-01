import {AbstractControl} from '@angular/forms';
import {trimmedRequired} from './trimmed-input.validator';

describe('trimmedRequired', () => {
    it('should return required when value is empty string', () => {
        const testAbstractControl = createTestAbstractControl('');
        expect(trimmedRequired(testAbstractControl)).toEqual({required: true});
    });

    it('should return required when value is only whitespace', () => {
        const testAbstractControl = createTestAbstractControl('      ');
        expect(trimmedRequired(testAbstractControl)).toEqual({required: true});
    });

    it('should return null when value is populated string', () => {
        const testAbstractControl = createTestAbstractControl('hello');
        expect(trimmedRequired(testAbstractControl)).toBeNull();
    });

    it('should return null when value is populated string with leading whitespace', () => {
        const testAbstractControl = createTestAbstractControl('      hello');
        expect(trimmedRequired(testAbstractControl)).toBeNull();
    });

    it('should return null when value is populated string with trailing whitespace', () => {
        const testAbstractControl = createTestAbstractControl('hello     ');
        expect(trimmedRequired(testAbstractControl)).toBeNull();
    });

    it('should return null when value is populated string with leading/trailing whitespace', () => {
        const testAbstractControl = createTestAbstractControl('     hello     ');
        expect(trimmedRequired(testAbstractControl)).toBeNull();
    });

    function createTestAbstractControl(value: any): AbstractControl {
        return { value } as AbstractControl;
    }
});
