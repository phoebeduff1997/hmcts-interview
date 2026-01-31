import {NotificationService} from './notification.service';
import {MatSnackBar, MatSnackBarConfig, MatSnackBarRef} from '@angular/material/snack-bar';
import {TestBed} from '@angular/core/testing';
import any = jasmine.any;

describe('NotificationService', () => {
    let notificationService: NotificationService;
    let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

        TestBed.configureTestingModule({
            providers: [
                NotificationService,
                {provide: MatSnackBar, useValue: mockSnackBar},
            ],
        });

        notificationService = TestBed.inject(NotificationService);
    });

    it('should create', () => {
        expect(notificationService).toBeTruthy();
    });

    describe('showErrorNotification', () => {
        it('should open with correct settings', () => {
            notificationService.showErrorNotification('Error occurred');

            expect(mockSnackBar.open).toHaveBeenCalledWith(
                'Error occurred',
                'Dismiss',
                {
                    panelClass: ['error-snackbar'],
                    verticalPosition: 'top',
                }
            );
        });

        it('should have custom action button', () => {
            notificationService.showErrorNotification('Error occurred', 'customButton');

            expect(mockSnackBar.open).toHaveBeenCalledWith(
                'Error occurred',
                'customButton',
                any(Object)
            );
        });
    });

    describe('showSuccessNotification', () => {
        it('should open with correct settings', () => {
            notificationService.showSuccessNotification('Success occurred');

            expect(mockSnackBar.open).toHaveBeenCalledWith(
                'Success occurred',
                'Dismiss',
                {
                    duration: 5000,
                    panelClass: ['success-snackbar'],
                    verticalPosition: 'bottom',
                }
            );
        });

        it('should have custom action button', () => {
            notificationService.showSuccessNotification('Success occurred', 'customButton');

            expect(mockSnackBar.open).toHaveBeenCalledWith(
                'Success occurred',
                'customButton',
                any(Object)
            );
        });
    });
});
