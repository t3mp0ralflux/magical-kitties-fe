import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, Subject, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { Constants } from "../Constants";
import { Account } from "../models/Account/account.model";
import { LoginModel } from "../models/Login/login.model";
import { LoginResponse } from "../models/Login/loginresponse.model";
import { PasswordResetRequest } from "../models/Login/passwordreset.model";
import { PasswordResetResponse } from "../models/Login/passwordresetresponse.model";
import { TokenRequest } from "../models/Login/tokenrequest.model";
import { ApiClient } from "./apiClient.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
    account?: Account;
    apiClient: ApiClient = inject(ApiClient);
    baseUrl: string = "";
    loggedOut: Subject<boolean> = new Subject<boolean>();

    constructor() {
        this.baseUrl = `${environment.baseUrl}/auth`;
    }

    login(loginInfo: LoginModel): Observable<LoginResponse>;
    login(loginInfo: LoginModel): Observable<HttpErrorResponse>;
    login(loginInfo: LoginModel): Observable<LoginResponse> | Observable<HttpErrorResponse> {
        return this.apiClient.post<LoginResponse>(`${this.baseUrl}/login`, loginInfo).pipe(
            tap((response: LoginResponse) => {
                localStorage.setItem(Constants.JWTToken, response.accessToken);
                localStorage.setItem(Constants.RefreshToken, response.refreshToken)
                this.account = response.account;
            })
        );
    }

    loginByToken(request: TokenRequest): Observable<LoginResponse> {
        return this.apiClient.post<LoginResponse>(`${this.baseUrl}/login/token`, request)
    }

    logout(): Observable<void> {
        return this.apiClient.post<any>(`${this.baseUrl}/logout/${this.account?.id}`, null).pipe(
            map((response: any) => {
                this.account = undefined;
                localStorage.removeItem(Constants.JWTToken);
                localStorage.removeItem(Constants.RefreshToken);
            })
        )
    }

    forgotPassword(request: PasswordResetRequest): Observable<PasswordResetResponse>;
    forgotPassword(request: PasswordResetRequest): Observable<HttpErrorResponse>;
    forgotPassword(request: PasswordResetRequest): Observable<PasswordResetResponse> | Observable<HttpErrorResponse> {
        return this.apiClient.post<PasswordResetResponse>(`${this.baseUrl}/passwordreset/request`, request);
    }

    verifyPasswordReset(passwordReset: PasswordResetRequest): Observable<HttpResponse<any>>;
    verifyPasswordReset(passwordReset: PasswordResetRequest): Observable<HttpErrorResponse>;
    verifyPasswordReset(passwordReset: PasswordResetRequest): Observable<HttpResponse<any>> | Observable<HttpErrorResponse> {
        return this.apiClient.post<any>(`${this.baseUrl}/passwordreset/verify`, passwordReset);
    }

    passwordReset(passwordReset: PasswordResetRequest): Observable<PasswordResetResponse>;
    passwordReset(passwordReset: PasswordResetRequest): Observable<HttpErrorResponse>;
    passwordReset(passwordReset: PasswordResetRequest): Observable<PasswordResetResponse> | Observable<HttpErrorResponse> {
        return this.apiClient.post<PasswordResetResponse>(`${this.baseUrl}/passwordreset`, passwordReset);
    }
}