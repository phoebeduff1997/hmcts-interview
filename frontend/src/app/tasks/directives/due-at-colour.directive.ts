import {Directive, ElementRef, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Status} from '../models/enums/status.model';

@Directive({
    selector: '[dueAtColour]'
})
export class DueAtColourDirective implements OnChanges {
    private el = inject(ElementRef);

    @Input('dueAtColour') dueAt!: string | Date;
    @Input('status') status!: Status;
    @Input('isIcon') isIcon: boolean = false;

    private static COMPLETE_COLOUR: string = 'LimeGreen';
    private static ALMOST_DUE_COLOUR: string = 'orange';
    private static LATE_COLOUR: string = 'red';

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        if(this.dueAt && this.status) {
            this.changeColourBasedOnDateDue();
        }
    }

    private changeColourBasedOnDateDue(): void {
        let oneWeekInFutureDateTime: Date = new Date();
        oneWeekInFutureDateTime.setDate(oneWeekInFutureDateTime.getDate() + 7);
        const dueDate: Date = new Date(this.dueAt);

        if(this.isIcon) {
            this.setIconColours(dueDate, oneWeekInFutureDateTime);
        } else {
            this.setDateTimeColours(dueDate, oneWeekInFutureDateTime);
        }
    }

    private setIconColours(dueAt: Date, oneWeekFuture: Date): void {
        if(this.isComplete()) {
            this.setColour(DueAtColourDirective.COMPLETE_COLOUR);
        } else if (this.isLate()) {
            this.setColour(DueAtColourDirective.LATE_COLOUR);
        } else if (this.isDueDateInNextWeek(dueAt, oneWeekFuture)) {
            this.setColour(DueAtColourDirective.ALMOST_DUE_COLOUR);
        } else {
            this.removeColour();
        }
    }

    private setDateTimeColours(dueAt: Date, oneWeekFuture: Date): void {
        if (this.isLate()) {
            this.setColour(DueAtColourDirective.LATE_COLOUR);
        } else if (this.isDueDateInNextWeek(dueAt, oneWeekFuture) && !this.isComplete()) {
            this.setColour(DueAtColourDirective.ALMOST_DUE_COLOUR);
        } else {
            this.removeColour();
        }
    }

    private isDueDateInNextWeek(dueAt: Date, oneWeekFuture: Date): boolean {
        return dueAt < oneWeekFuture;
    }

    private isComplete(): boolean {
        return this.status === Status.COMPLETE;
    }

    private isLate(): boolean {
        return this.status === Status.OVERDUE;
    }

    private setColour(colour: string): void {
        this.el.nativeElement.style.color = colour;
    }

    private removeColour(): void {
        this.el.nativeElement.style.removeProperty('color');
    }

}
