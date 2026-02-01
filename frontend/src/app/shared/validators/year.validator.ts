import {ValidationErrors} from '@angular/forms';

export function validateDateYear(value: any): ValidationErrors | null {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
        return {
            invalidDate: true
        };
    }

    const year = value.getFullYear();
    if (year < 1900 || year > 3000) {
        return {
            outOfRange: true
        };
    }

    return null;
}
