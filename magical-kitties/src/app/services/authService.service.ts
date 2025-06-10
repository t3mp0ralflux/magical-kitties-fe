import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Constants } from "../Constants";
import { Account } from "../models/account.model";
import { LoginModel } from "../models/login.model";
import { LoginResponse } from "../models/loginresponse.model";
import { TokenRequest } from "../models/tokenrequest.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
    account?: Account;
    http: HttpClient = inject(HttpClient);
    baseUrl: string = "";

    constructor() {
        this.baseUrl = environment.baseUrl;
    }

    login(loginInfo: LoginModel): Observable<void> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, loginInfo).pipe(
            map((response: LoginResponse) => {
                localStorage.setItem(Constants.JWTToken, response.accessToken);
                localStorage.setItem(Constants.RefreshToken, response.refreshToken)
                this.account = response.account;
            }),
            catchError(error => {
                throw (error);
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