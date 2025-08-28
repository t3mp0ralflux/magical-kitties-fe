import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Account } from "../../models/Account/account.model";
import { AccountActivationResponse } from "../../models/Account/accountactivationresponse.model";
import { AccountCreateRequest } from "../../models/Account/accountcreaterequest.model";
import { ApiClient, HttpMethod } from "../../services/apiClient.service";

@Injectable({ providedIn: 'root' })
export class LoginAPIService {
    apiClient: ApiClient = inject(ApiClient);
    baseUrl: string = "";

    constructor() {
        this.baseUrl = `${environment.baseUrl}/api`;
    }

    register(request: AccountCreateRequest): Observable<Account>;
    register(request: AccountCreateRequest): Observable<HttpErrorResponse>;
    register(request: AccountCreateRequest): Observable<Account> | Observable<HttpErrorResponse> {
        return this.apiClient.request<Account>({
            path: `${this.baseUrl}/accounts`,
            method: HttpMethod.POST,
            body: request
        })
    }

    activateAccount(username: string, activationCode: string): Observable<AccountActivationResponse>;
    activateAccount(username: string, activationCode: string): Observable<HttpErrorResponse>;
    activateAccount(username: string, activationCode: string): Observable<AccountActivationResponse> | Observable<HttpErrorResponse> {
        return this.apiClient.request<AccountActivationResponse>({
            path: `${this.baseUrl}/accounts/activate/${username}/${activationCode}`,
            method: HttpMethod.GET
        });
    }

    resendActivation(username: string, activationCode: string): Observable<AccountActivationResponse>;
    resendActivation(username: string, activationCode: string): Observable<HttpErrorResponse>;
    resendActivation(username: string, activationCode: string): Observable<AccountActivationResponse> | Observable<HttpErrorResponse> {
        return this.apiClient.request<AccountActivationResponse>({
            path: `${this.baseUrl}/accounts/activate/${username}/${activationCode}/resend`,
            method: HttpMethod.POST
        });
    }
}