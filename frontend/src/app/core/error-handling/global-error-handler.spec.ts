import {GlobalErrorHandler} from './global-error-handler';
import {TestBed} from '@angular/core/testing';
import {NotificationService} from '../../shared/services/notification.service';

describe('GlobalErrorHandler', () => {
    let globalErrorHandler: GlobalErrorHandler;
    let mockNotificationService: jasmine.SpyObj<NotificationService>;

    beforeEach(() => {
        mockNotificationService = jasmine.createSpyObj('NotificationService', ['showErrorNotification']);

        TestBed.configureTestingModule({
            providers: [
                GlobalErrorHandler,
                { provide: NotificationService, useValue: mockNotificationService }
            ]
        });

        globalErrorHandler = TestBed.inject(GlobalErrorHandler);
        spyOn(console, 'error').and.callFake(() => {});
    });

    it('should create', () => {
        expect(globalErrorHandler).toBeTruthy();
    });

    describe('handleError', () => {
        it('should call showErrorNotification on first error', () => {
            const testError = new Error('Test error');
            globalErrorHandler.handleError(testError);

            expect(mockNotificationService.showErrorNotification)
                .toHaveBeenCalledWith('An unexpected error occurred');
        });

        it('should not call showErrorNotification if errorVisible is true', () => {
            globalErrorHandler['errorVisible'] = true;

            globalErrorHandler.handleError(new Error('Another error'));
            expect(mockNotificationService.showErrorNotification).not.toHaveBeenCalled();
        });
    });
});
