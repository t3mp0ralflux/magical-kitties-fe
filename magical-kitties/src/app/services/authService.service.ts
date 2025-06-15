import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { Constants } from "../Constants";
import { Account } from "../models/Account/account.model";
import { LoginModel } from "../models/Login/login.model";
import { LoginResponse } from "../models/Login/loginresponse.model";
import { TokenRequest } from "../models/Login/tokenrequest.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
    account?: Account;
    http: HttpClient = inject(HttpClient);
    baseUrl: string = "";

    constructor() {
        this.baseUrl = environment.baseUrl;
    }

    login(loginInfo: LoginModel): Observable<LoginResponse>;
    login(loginInfo: LoginModel): Observable<HttpErrorResponse>;
    login(loginInfo: LoginModel): Observable<LoginResponse> | Observable<HttpErrorResponse> {
        return this.http.post<any>(`${this.baseUrl}/auth/login`, loginInfo).pipe(
            tap((response: LoginResponse) => {
                localStorage.setItem(Constants.JWTToken, response.accessToken);
                localStorage.setItem(Constants.RefreshToken, response.refreshToken)
                this.account = response.account;
            })
        );
    }

    loginByToken(request: TokenRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login/token`, request)
    }

    logout(): Observable<void> {
        return this.http.post<any>(`${this.baseUrl}/auth/logout/${this.account?.id}`, null).pipe(
            map((response: any) => {
                this.account = undefined;
                localStorage.removeItem(Constants.JWTToken);
                localStorage.removeItem(Constants.RefreshToken);
            })
        )
    }


}