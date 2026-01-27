import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement, Input} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DueAtColourDirective} from './due-at-colour.directive';
import {Status} from '../models/enums/status.model';

@Component({
    imports: [
        DueAtColourDirective
    ],
    template: `
        <div id="input"
             [isIcon]="isIcon"
             [dueAtColour]="date"
             [status]="status"
        >
            Custom highlight
        </div>
    `
})
class TestComponent {
    @Input() date!: Date;
    @Input() isIcon!: boolean;
    @Input() status!: Status;

    constructor() {}
}


describe('DueAtColourDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TestComponent,
                DueAtColourDirective
            ],
            declarations: []
        });
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        inputEl = fixture.debugElement.query(By.css('#input'));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('changeColourBasedOnDateDue', () => {
        describe('isIcon', () => {
            it('should be green when status is complete', () => {
                setUpValues(30, Status.COMPLETE, true);
                expect(inputEl.nativeElement.style.color).toBe('limegreen');
            });

            it('should be red when status is overdue', () => {
                setUpValues(-20, Status.OVERDUE, true);
                expect(inputEl.nativeElement.style.color).toBe('red');
            });

            it('should be orange when status is in_progress and deadline less than one week away', () => {
                setUpValues(6, Status.IN_PROGRESS, true);
                expect(inputEl.nativeElement.style.color).toBe('orange');
            });

            it('should be orange when status is not_started and deadline less than one week away', () => {
                setUpValues(6, Status.NOT_STARTED, true);
                expect(inputEl.nativeElement.style.color).toBe('orange');
            });

            it('should not have a colour when status is in_progress and deadline more than one week away', () => {
                setUpValues(30, Status.IN_PROGRESS, true);
                expect(inputEl.nativeElement.style.color).toBe('');
            });

            it('should not have a colour when status is not_started and deadline more than one week away', () => {
                setUpValues(30, Status.NOT_STARTED, true);
                expect(inputEl.nativeElement.style.color).toBe('');
            });
        });

        describe('isNotIcon', () => {
            it('should be red when status is overdue', () => {
                setUpValues(-20, Status.OVERDUE, false);
                expect(inputEl.nativeElement.style.color).toBe('red');
            });

            it('should not have a colour when status is complete', () => {
                setUpValues(30, Status.COMPLETE, false);
                expect(inputEl.nativeElement.style.color).toBe('');
            });

            it('should not have a colour when status is not_started and deadline more than one week away', () => {
                setUpValues(30, Status.NOT_STARTED, false);
                expect(inputEl.nativeElement.style.color).toBe('');
            });

            it('should not have a colour when status is in_progress and deadline more than one week away', () => {
                setUpValues(30, Status.IN_PROGRESS, false);
                expect(inputEl.nativeElement.style.color).toBe('');
            });

            it('should be orange when status is in_progress and deadline less than one week away', () => {
                setUpValues(6, Status.IN_PROGRESS, false);
                expect(inputEl.nativeElement.style.color).toBe('orange');
            });

            it('should be orange when status is not_started and deadline less than one week away', () => {
                setUpValues(6, Status.NOT_STARTED, false);
                expect(inputEl.nativeElement.style.color).toBe('orange');
            });
        });

        function setUpValues(days: number, status: Status, isIcon: boolean): void {
            let futureDate: Date = new Date();
            futureDate.setDate(futureDate.getDate() + days);
            component.date = futureDate;
            component.status = status;
            component.isIcon = isIcon;
            fixture.detectChanges();
        }
    });
});
