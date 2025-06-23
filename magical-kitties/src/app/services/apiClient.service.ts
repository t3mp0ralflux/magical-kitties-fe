import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError, Observable, throwError } from "rxjs";
import { ValidationErrorResponse } from "../models/Errors/ValidationErrorResponse.model";

@Injectable({ providedIn: 'root' })
export class ApiClient {
    private http: HttpClient = inject(HttpClient);
    private _snackBar: MatSnackBar = inject(MatSnackBar);

    post<T>(url: string, payload?: any, options?: object): Observable<T> {
        return this.http.post<T>(url, payload, options).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    get<T>(url: string, options?: object): Observable<T> {
        5
        return this.http.get<T>(url, options).pipe(
            catchError((err) => this.handleError(err))
        )
    }

    handleError(error: HttpErrorResponse) {
        switch (error.status) {
            case 401:
            case 400:
            case 404:
                if (error.error instanceof ValidationErrorResponse) {
                    return throwError(() => error.error.errors);
                }

                break;
            default:
                this._snackBar.open("Unknown server error. Contact Support.", "Close", { duration: 2000 });
                break;
        }

        return throwError(() => error);
    }
}