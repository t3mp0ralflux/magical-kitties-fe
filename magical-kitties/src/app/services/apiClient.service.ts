import { HttpClient, HttpContext, HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { inject, Injectable, OnDestroy } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError, EMPTY, finalize, map, Observable, Subject, Subscription, switchMap, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { Constants } from "../Constants";
import { Account } from "../models/Account/account.model";
import { LoginModel } from "../models/Login/login.model";
import { LoginResponse } from "../models/Login/loginresponse.model";

export const TOKEN_CONTEXT = new HttpContextToken<string>(() => "<access_token>");

export enum HttpMethod {
    POST = "post",
    GET = "get",
    DELETE = "delete",
    PUT = "put"
}

/**
 * @description Configuration for the HTTP Request
 * @param path Endpoint Path.
 * @param formData (optional) Form Data for the request.
 * @param body (optional) Request Body.
 * @param httpParams (optional) Http Parameters.
 * @param method Default is POST.
 * @param skipAuth Whether authentication should be skipped.
 * @param headerResponse Headers should be included in the response.
 */
export interface RequestConfig {
    path: string;
    formData?: FormData;
    body?: any;
    httpParams?: HttpParams;
    method?: HttpMethod;
    skipAuth?: boolean;
    headerResponse?: boolean;
    responseType?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiClient implements HttpInterceptor, OnDestroy {
    private loginApiUrl = `${environment.baseUrl}/auth/login`;
    private logoutApiUrl = `${environment.baseUrl}/auth/logout`;
    private refreshApiUrl = `${environment.baseUrl}/auth/token/refresh`;
    private http: HttpClient = inject(HttpClient);
    private _snackBar: MatSnackBar = inject(MatSnackBar);
    private refreshTokenInProgress = false;
    private tokenRefreshedSource = new Subject<Account | undefined>();
    private tokenRefreshed$ = this.tokenRefreshedSource.asObservable();
    private tokenExpiredObserver: (() => void)[] = [];
    private tokenRefreshedSubscription?: Subscription;

    constructor() {}

    ngOnDestroy(): void {
        if (this.tokenRefreshedSubscription) {
            this.tokenRefreshedSubscription.unsubscribe();
        }
    }

    public addTokenExpiredObserver(observer: () => void) {
        this.tokenExpiredObserver.push(observer);
    }

    calculateRequestHeader(req: HttpRequest<any>): HttpRequest<any> {
        let request = req.clone();
        if (req.context.has(TOKEN_CONTEXT)) {
            let typeOfAuthorization = req.context.get(TOKEN_CONTEXT);
            if (typeOfAuthorization == "<access_token>") {
                request = req.clone({
                    headers: req.headers.set('authorization', `Bearer ${this.getAccessToken()}`)
                });
            } else if (typeOfAuthorization == "<refresh_token>") {
                request = req.clone({
                    headers: req.headers.set('authorization', `Bearer ${this.getRefreshToken()}`)
                });
            }
        }

        return request;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let request = this.calculateRequestHeader(req);
        return next.handle(request).pipe(
            tap({
                next: (event: HttpEvent<any>) => {}
            }),
            catchError((_error) => {
                return this.handleError(_error, req, next);
            }),
            finalize(() => {})
        );
    }

    handleError(response: HttpErrorResponse, request?: HttpRequest<any>, next?: HttpHandler) {
        switch (response.status) {
            case 401:
                if (!response.url?.includes("login")) {
                    return this.refreshToken().pipe(
                        switchMap(() => {
                            if (request !== undefined && next !== undefined) {
                                let httpRequest = this.calculateRequestHeader(request);
                                return next.handle(httpRequest);
                            }
                            return EMPTY;
                        })
                    );
                }

                return throwError(() => response);
            case 403:
                return throwError(() => response);
            case 400:
            case 404:
                try {
                    const error = JSON.parse(response.error);
                    if (error.errors) {
                        return throwError(() => error.errors);
                    }

                    return throwError(() => response);

                } catch {
                    return throwError(() => response);
                }
            default:
                this._snackBar.open("Unknown server error. Contact Support.", "Close", { duration: 10000 });
                break;
        }

        return throwError(() => response);
    }

    tryRefreshToken(): Observable<Account> {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
            return this.http.post<LoginResponse>(`${this.refreshApiUrl}`, null, {
                context: new HttpContext().set(TOKEN_CONTEXT, '<refresh_token>')
            }).pipe(
                map((response: LoginResponse) => {
                    this.storeTokens(response.accessToken, response.refreshToken);
                    return response.account;
                }),
                catchError((err) => {
                    if (err.error.message.includes("Failed to fetch")) {
                        return EMPTY;
                    }

                    return throwError(() => new Error());
                })
            );
        } else {
            return throwError(() => new Error('No refresh token available, please log in again.'));
        }
    }

    refreshToken(): Observable<Account> {
        if (this.refreshTokenInProgress) {
            console.log("Refresh token in progress");

            return new Observable(observer => {
                this.tokenRefreshedSubscription = this.tokenRefreshed$.subscribe((refreshed) => {
                    if (refreshed) {
                        observer.next(refreshed);
                        observer.complete();
                    } else {
                        observer.error("Session expired, please log in again.");
                    }
                });
            });
        } else {
            if (!this.isLoggedIn()) {
                this.tokenRefreshedSource.next(new Account());
                this.clearTokens();

                return EMPTY;
            } else {
                this.refreshTokenInProgress = true;
                return this.tryRefreshToken().pipe(
                    tap((account: Account) => {
                        this.refreshTokenInProgress = false;
                        this.tokenRefreshedSource.next(account);
                    }),
                    catchError((err) => {
                        if (err.error.message) {

                        }

                        return throwError(() => new Error('Session expired, please log in again.'));
                    })
                );
            }
        }
    }

    private tokenExpired(token: string) {
        const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
        return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }

    public isLoggedIn(): boolean {
        const token = localStorage.getItem(Constants.RefreshToken);
        if (token !== null) {
            if (!this.tokenExpired(token!)) {
                return true;
            } else {
                this.clearTokens();
                this.tokenExpiredObserver.forEach(observer => {
                    observer();
                })
            }
        }

        return false;
    }

    public storeTokens(accessToken: string, refreshToken: string) {
        localStorage.setItem(Constants.JWTToken, accessToken);
        localStorage.setItem(Constants.RefreshToken, refreshToken);
    }

    public getAccessToken(): string | null {
        return localStorage.getItem(Constants.JWTToken);
    }
    public getRefreshToken(): string | null {
        return localStorage.getItem(Constants.RefreshToken);
    }
    private clearTokens(): Observable<never> {
        localStorage.removeItem(Constants.JWTToken);
        localStorage.removeItem(Constants.RefreshToken);

        return EMPTY;
    }

    login(loginInfo: LoginModel): Observable<Account> {
        return this.request<LoginResponse>({
            method: HttpMethod.POST,
            path: this.loginApiUrl,
            skipAuth: true,
            body: loginInfo
        }).pipe(
            map((response: LoginResponse) => {
                this.storeTokens(response.accessToken, response.refreshToken);
                return response.account;
            })
        )
    }

    logout(): Observable<void> {
        const refreshToken = this.getRefreshToken();

        if (refreshToken) {
            return this.request({
                method: HttpMethod.POST,
                path: `${this.logoutApiUrl}/${refreshToken}`
            }).pipe(
                map(_ => {
                    this.clearTokens();
                    return undefined;
                }),
                catchError(err => {
                    console.log(err);
                    return EMPTY;
                })
            )
        } else {
            return this.clearTokens();
        }
    }

    request<T>(config: RequestConfig): Observable<T> {
        let options = {};

        if (!config.skipAuth) {
            if (!this.isLoggedIn()) {
                return EMPTY;
            }
            options = {
                context: new HttpContext().set(TOKEN_CONTEXT, '<access_token>')
            }
        }

        if (config.headerResponse) {
            Object.assign(options, { observe: 'response' });
        }

        if (config.httpParams) {
            Object.assign(options, { params: config.httpParams });
        }

        if (config.method === undefined) {
            config.method = HttpMethod.POST;
        }

        if (config.responseType !== undefined) {
            Object.assign(options, { responseType: "text" });
        } else {
            Object.assign(options, { responseType: "json" });
        }

        if (config.body !== undefined || config.formData !== undefined) {
            if (config.body != undefined) {
                Object.assign(options, { body: config.body });
            } else if (config.formData != undefined) {
                Object.assign(options, { body: config.formData });
            }
        }

        return this.http.request<T>(config.method, config.path, options);
    }
}