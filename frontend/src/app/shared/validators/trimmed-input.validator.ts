import {AbstractControl, ValidationErrors} from '@angular/forms';

export function trimmedRequired(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value === 'string' && value.trim() === '') {
        return { required: true };
    }
    return null;
}
