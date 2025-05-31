import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Account } from "../models/account.model";
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
                sessionStorage.setItem("token", response.token);
                this.account = response.account;
            }),
            catchError(error => {
                throw (error);
            })
        );
    }
}