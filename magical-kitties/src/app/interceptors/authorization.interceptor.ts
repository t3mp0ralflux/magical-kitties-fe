import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { Constants } from '../Constants';

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
    const headers = new HttpHeaders().set('content-type', "application/json");
    const updatedHeaders = headers.set('Authorization', `Bearer ${localStorage.getItem(Constants.JWTToken)}`);

    const requestWithAuthorization = req.clone({
        headers: new HttpHeaders({
            'Access-Control-Allow-Headers': 'Request-Header, Response-Header',
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': 'Response-Header',
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(Constants.JWTToken)}`
        }),
    });

    return next(requestWithAuthorization);
};
