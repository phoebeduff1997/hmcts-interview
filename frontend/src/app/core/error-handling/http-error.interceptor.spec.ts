import { TestBed } from '@angular/core/testing';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { NotificationService } from '../../shared/services/notification.service';
import { HttpHandler, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('HttpErrorInterceptor', () => {
    let httpErrorInterceptor: HttpErrorInterceptor;
    let mockNotificationService: jasmine.SpyObj<NotificationService>;
    let mockHttpHandler: jasmine.SpyObj<HttpHandler>;
    let mockRequest: HttpRequest<unknown>;
    const TEST_ERROR_MESSAGE = 'Error message';

    beforeEach(() => {
        mockNotificationService = jasmine.createSpyObj('NotificationService', ['showErrorNotification']);
        mockHttpHandler = jasmine.createSpyObj('HttpHandler', ['handle']);

        TestBed.configureTestingModule({
            providers: [
                HttpErrorInterceptor,
                { provide: NotificationService, useValue: mockNotificationService },
                { provide: HttpHandler, useValue: mockHttpHandler }
            ],
        });

        httpErrorInterceptor = TestBed.inject(HttpErrorInterceptor);
        mockRequest = new HttpRequest('GET', '/test');
        spyOn(console, 'error').and.callFake(() => {});
    });

    it('should create', () => {
        expect(httpErrorInterceptor).toBeTruthy();
    });

    describe('intercept', () => {
        it('should return result if no error occurs', (done) => {
            const mockRequest = new HttpRequest('GET', '/test');
            const mockResponse: HttpEvent<any> = {} as HttpEvent<any>;

            mockHttpHandler.handle.and.returnValue(of(mockResponse));

            httpErrorInterceptor.intercept(mockRequest, mockHttpHandler).subscribe((response) => {
                expect(response).toBe(mockResponse);
                expect(mockNotificationService.showErrorNotification).not.toHaveBeenCalled();
                done();
            });
        });
    });

    it('should handle client-side errors', (done) => {
        const mockError = new HttpErrorResponse({ error: new ErrorEvent('Network error',
                { message: TEST_ERROR_MESSAGE }), status: 0 });

        mockHttpHandler.handle.and.returnValue(throwError(() => mockError));

        checkResponseHasCorrectError(mockRequest, mockError, done, 'Client error: ' + TEST_ERROR_MESSAGE);
    });

    it('should handle 400 errors with single custom message', (done) => {
        const errorPayload = { errors: [{ message: TEST_ERROR_MESSAGE + ' custom 1' }] };
        const mockError = new HttpErrorResponse({ error: errorPayload, status: 400 });

        mockHttpHandler.handle.and.returnValue(throwError(() => mockError));

        checkResponseHasCorrectError(mockRequest, mockError, done, TEST_ERROR_MESSAGE + ' custom 1');
    });

    it('should handle 400 errors with multiple custom message', (done) => {
        let errorMessage1: string = TEST_ERROR_MESSAGE + ' custom 1';
        let errorMessage2: string = TEST_ERROR_MESSAGE + ' custom 2';
        const errorPayload = { errors: [{ message: errorMessage1 }, { message: errorMessage2 }] };
        const mockError = new HttpErrorResponse({ error: errorPayload, status: 400 });

        mockHttpHandler.handle.and.returnValue(throwError(() => mockError));

        checkResponseHasCorrectError(mockRequest, mockError, done, errorMessage1 + ', ' + errorMessage2);
    });

    it('should handle 401 errors', (done) => {
        const mockError = new HttpErrorResponse({ error: {}, status: 401 });

        mockHttpHandler.handle.and.returnValue(throwError(() => mockError));

        checkResponseHasCorrectError(mockRequest, mockError, done, 'Unauthorized, please log in again');
    });

    it('should handle 403 errors', (done) => {
        const mockError = new HttpErrorResponse({ error: {}, status: 403 });

        mockHttpHandler.handle.and.returnValue(throwError(() => mockError));

        checkResponseHasCorrectError(mockRequest, mockError, done, 'Forbidden, you do not have permission for this action');
    });

    it('should handle 404 errors', (done) => {
        const mockError = new HttpErrorResponse({ error: {}, status: 404 });

        mockHttpHandler.handle.and.returnValue(throwError(() => mockError));

        checkResponseHasCorrectError(mockRequest, mockError, done, 'Resource not found');
    });

    it('should handle 500 errors', (done) => {
        const mockError = new HttpErrorResponse({ error: {}, status: 500 });

        mockHttpHandler.handle.and.returnValue(throwError(() => mockError));

        checkResponseHasCorrectError(mockRequest, mockError, done, 'Server error, please try again later');
    });

    it('should handle other errors', (done) => {
        const mockError = new HttpErrorResponse({ error: { message: 'Unknown error' }, status: 999 });

        mockHttpHandler.handle.and.returnValue(throwError(() => mockError));

        checkResponseHasCorrectError(mockRequest, mockError, done, 'Server error: Unknown error');
    });

    function checkResponseHasCorrectError(mockRequest: HttpRequest<unknown>, mockError: HttpErrorResponse,
                                          done: DoneFn, errorMessage: string): void {
        httpErrorInterceptor.intercept(mockRequest, mockHttpHandler).subscribe({
            next: () => {},
            error: (err) => {
                expect(mockNotificationService.showErrorNotification).toHaveBeenCalledWith(errorMessage);
                expect(err).toBe(mockError);
                done();
            },
        });
    }
});
