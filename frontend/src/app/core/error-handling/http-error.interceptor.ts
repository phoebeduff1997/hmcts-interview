import {inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {NotificationService} from '../../shared/services/notification.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    private notificationService = inject(NotificationService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                const message = this.getErrorMessage(err);
                this.notificationService.showErrorNotification(message);
                console.error('HTTP error:', err);
                return throwError(() => err);
            })
        );
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        if (error.error instanceof ErrorEvent) {
            return `Client error: ${error.error.message}`;
        } else {
            switch (error.status) {
                case 400:
                    return error.error?.errors ? this.get400ErrorMessage(error.error.errors) : 'Bad request, please check your input';
                case 401:
                    return 'Unauthorized, please log in again';
                case 403:
                    return 'Forbidden, you do not have permission for this action';
                case 404:
                    return 'Resource not found';
                case 500:
                    return 'Server error, please try again later';
                default:
                    return `Server error: ${error.error.message}`;
            }
        }
    }

    private get400ErrorMessage(errors: HttpErrorResponse[]): string {
        let errorMessages = '';
        errors.forEach(error => errorMessages = errorMessages + error.message + ', ');
        return errorMessages;
    }
}
