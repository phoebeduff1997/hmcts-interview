import {Pipe, PipeTransform} from '@angular/core';
import {TitleCasePipe} from '@angular/common';

@Pipe({
    name: 'displayStringEnumValues'
})
export class DisplayStringEnumValuesPipe implements PipeTransform {

    constructor(private titleCasePipe: TitleCasePipe) {
    }

    transform(value: string | undefined): string {
        let removeUnderscore = value?.replace(/_/g, " ");
        if (removeUnderscore) {
            return this.titleCasePipe.transform(removeUnderscore);
        }
        return '';
    }
}
