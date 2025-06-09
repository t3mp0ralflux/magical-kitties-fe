import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { catchError, map, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Constants } from "../Constants";
import { Account } from "../models/account.model";
import { JwtPayload } from "../models/JwtToken.model";
import { LoginModel } from "../models/login.model";
import { LoginResponse } from "../models/loginresponse.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
    account?: Account;
    http: HttpClient = inject(HttpClient);
    baseUrl: string = "";

    constructor() {
        this.baseUrl = environment.baseUrl;
    }

    login(loginInfo: LoginModel): Observable<void> {
        return this.http.post<LoginResponse>(this.baseUrl + "/auth/login", loginInfo).pipe(
            map((response: LoginResponse) => {
                sessionStorage.setItem(Constants.JWTToken, response.token);
                this.account = response.account;
            }),
            catchError(error => {
                throw (error);
            })
        );
    }

    loginByToken(token: string) {
        const parsedToken = jwtDecode<JwtPayload>(token);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.http.post<LoginResponse>(this.baseUrl + "/auth/login/token", JSON.stringify(parsedToken.email!), { headers: headers })
    }

    logout(): void {
        this.account = undefined;
        sessionStorage.removeItem(Constants.JWTToken);
    }
}