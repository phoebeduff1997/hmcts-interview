import {inject, Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private snackbar = inject(MatSnackBar);
    private snackBarRef?: MatSnackBarRef<any>;

    showErrorNotification(message: string, action: string = 'Dismiss') {
        this.snackbar.open(message, action, {
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
        });
    }

    showSuccessNotification(message: string, action: string = 'Dismiss') {
        this.snackBarRef?.dismiss();
        this.snackbar.open(message, action, {
            duration: 5000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'bottom',
        });
    }
}
