import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogComponent} from './confirm-dialog.component';

describe('TaskList', () => {

    let component: ConfirmDialogComponent;
    let fixture: ComponentFixture<ConfirmDialogComponent>;
    let mockDialog: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>

    beforeEach(async () => {
        mockDialog = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            declarations: [],
            imports: [
                ConfirmDialogComponent
            ],
            providers: [
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: {} }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('confirm', () => {
        it('should use true on confirm', () => {
            component.confirm();

            expect(mockDialog.close).toHaveBeenCalledWith(true);
        });
    });

    describe('cancel', () => {
        it('should use false on cancel', () => {
            component.cancel();

            expect(mockDialog.close).toHaveBeenCalledWith(false);
        });
    });
});
