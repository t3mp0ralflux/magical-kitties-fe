import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class LoginApiService {
    baseUrl: string;
    private http = inject(HttpClient);
    constructor() {
        this.baseUrl = environment.baseUrl;
    }

}