import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, EMPTY, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { Account } from "../models/Account/account.model";
import { LoginModel } from "../models/Login/login.model";
import { PasswordResetRequest } from "../models/Login/passwordreset.model";
import { PasswordResetResponse } from "../models/Login/passwordresetresponse.model";
import { ApiClient, HttpMethod } from "./apiClient.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
    account?: Account;
    apiClient: ApiClient = inject(ApiClient);
    baseUrl: string = "";

    constructor() {
        this.baseUrl = `${environment.baseUrl}/auth`;
    }

    login(loginInfo: LoginModel): Observable<Account>;
    login(loginInfo: LoginModel): Observable<HttpErrorResponse>;
    login(loginInfo: LoginModel): Observable<Account> | Observable<HttpErrorResponse> {
        return this.apiClient.login(loginInfo).pipe(
            tap((response: Account) => {
                this.account = response;
            })
        );
    }

    refreshLogin() {
        return this.apiClient.refreshToken().pipe(
            tap((response: Account) => {
                this.account = response;
            }),
            catchError((error) => {
                return EMPTY;
            })
        );
    }

    logout(): Observable<void> {
        return this.apiClient.logout().pipe(
            tap(_ => this.account = undefined)
        );
    }

    forgotPassword(request: PasswordResetRequest): Observable<PasswordResetResponse>;
    forgotPassword(request: PasswordResetRequest): Observable<HttpErrorResponse>;
    forgotPassword(request: PasswordResetRequest): Observable<PasswordResetResponse> | Observable<HttpErrorResponse> {
        return this.apiClient.request<PasswordResetResponse>({
            path: `${this.baseUrl}/passwordreset/request`,
            method: HttpMethod.POST,
            body: request
        });
    }

    verifyPasswordReset(passwordReset: PasswordResetRequest): Observable<HttpResponse<any>>;
    verifyPasswordReset(passwordReset: PasswordResetRequest): Observable<HttpErrorResponse>;
    verifyPasswordReset(passwordReset: PasswordResetRequest): Observable<HttpResponse<any>> | Observable<HttpErrorResponse> {
        return this.apiClient.request<any>({ path: `${this.baseUrl}/passwordreset/verify`, method: HttpMethod.POST, body: passwordReset });
    }

    passwordReset(passwordReset: PasswordResetRequest): Observable<PasswordResetResponse>;
    passwordReset(passwordReset: PasswordResetRequest): Observable<HttpErrorResponse>;
    passwordReset(passwordReset: PasswordResetRequest): Observable<PasswordResetResponse> | Observable<HttpErrorResponse> {
        return this.apiClient.request<PasswordResetResponse>({
            path: `${this.baseUrl}/passwordreset`,
            method: HttpMethod.POST,
            body: passwordReset
        });
    }
}