import {validateDateYear} from './year.validator';

describe('validateDateYear', () => {
    it('should return invalid date when value is not a date', () => {
        expect(validateDateYear("not a date")).toEqual({invalidDate: true})
    });

    it('should return invalid date when value is not a number', () => {
        expect(validateDateYear(new Date("not a date"))).toEqual({invalidDate: true})
    });

    it('should return out of range when year is less than 1900', () => {
        const date = new Date();
        date.setFullYear(1899);
        expect(validateDateYear(date)).toEqual({outOfRange: true})
    });

    it('should return out of range when year is more than 3000', () => {
        const date = new Date();
        date.setFullYear(3001);
        expect(validateDateYear(date)).toEqual({outOfRange: true})
    });

    it('should return null when year is between 1900 and 3000', () => {
        const date1900 = new Date();
        date1900.setFullYear(1900);
        const date3000 = new Date();
        date3000.setFullYear(3000);
        const date2026 = new Date();
        date2026.setFullYear(2026);


        expect(validateDateYear(date1900)).toBeNull();
        expect(validateDateYear(date3000)).toBeNull();
        expect(validateDateYear(date2026)).toBeNull();
    });
});
