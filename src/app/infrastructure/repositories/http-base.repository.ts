import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL, ERROR_UNEXPECTED, UNKNOWN_ERROR } from '../../core/constants/constants';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export abstract class HttpBaseRepository {

    constructor(protected http: HttpClient) { }

    protected executeQuery<T>(endpoint: string, params?: any): Observable<T> {
        return this.http
            .get<T>(`${API_URL}${endpoint}`, {
                params: {
                    ...params,
                },
            })
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let message = UNKNOWN_ERROR;

                    if (error.status === HttpStatusCode.BadRequest) {
                        message = error.error?.message || error.message;
                    }

                    if (error.status === HttpStatusCode.InternalServerError) {
                        message = error.error?.message || ERROR_UNEXPECTED;
                    }

                    const customError = {
                        status: error.status,
                        message: message,
                        url: error.url,
                        error: error.error,
                    };
                    return throwError(() => customError);
                })
            );
    }

    protected executePut<T>(endPoint: string, body: any): Observable<T> {
        return this.http.put<T>(`${API_URL}${endPoint}`, body).pipe(
            catchError((error: HttpErrorResponse) => {
                let message = UNKNOWN_ERROR;

                if (
                    error.status === HttpStatusCode.Unauthorized &&
                    error.error.message
                ) {
                    message = error.error.message;
                }

                if (error.status === HttpStatusCode.InternalServerError) {
                    message = ERROR_UNEXPECTED;
                }

                const customError = {
                    status: error.status,
                    message: message,
                    url: error.url,
                    error: error.error,
                };

                return throwError(() => customError);
            })
        );
    }

    protected executePost<T>(endPoint: string, body: any): Observable<T> {
        return this.http.post<T>(`${API_URL}${endPoint}`, body).pipe(
            catchError((error: HttpErrorResponse) => {
                let message = UNKNOWN_ERROR;

                if (
                    error.status === HttpStatusCode.Unauthorized &&
                    error.error.message
                ) {
                    message = error.error.message;
                }

                if (error.status === HttpStatusCode.InternalServerError) {
                    message = ERROR_UNEXPECTED;
                }

                const customError = {
                    status: error.status,
                    message: message,
                    url: error.url,
                    error: error.error,
                };

                return throwError(() => customError);
            })
        );
    }

    protected executeDelete<T>(endPoint: string): Observable<T> {
        return this.http.delete<T>(`${API_URL}${endPoint}`).pipe(
            catchError((error: HttpErrorResponse) => {
                let message = UNKNOWN_ERROR;

                if (
                    error.status === HttpStatusCode.Unauthorized &&
                    error.error.message
                ) {
                    message = error.error.message;
                }

                if (error.status === HttpStatusCode.InternalServerError) {
                    message = ERROR_UNEXPECTED;
                }

                const customError = {
                    status: error.status,
                    message: message,
                    url: error.url,
                    error: error.error,
                };

                return throwError(() => customError);
            })
        );
    }
}
