import {ErrorHandler, inject, Injectable} from '@angular/core';
import {NotificationService} from '../../shared/services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    private notificationService = inject(NotificationService);
    private defaultErrorMessage = 'An unexpected error occurred';
    private errorVisible = false;

    handleError(error: any): void {
        console.error('Global error:', error);

        if (this.errorVisible) return;

        this.errorVisible = true;
        this.notificationService.showErrorNotification(this.defaultErrorMessage);
    }
}
