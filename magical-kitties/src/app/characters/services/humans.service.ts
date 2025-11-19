import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Problem } from "../../models/Characters/problem.model";
import { HumanUpdateRequest } from "../../models/Humans/humanupdaterequest.model";
import { ProblemUpdateRequest } from "../../models/Humans/problemupdaterequest.model";
import { ApiClient, HttpMethod } from "../../services/apiClient.service";

@Injectable({ providedIn: "root" })
export class HumanAPIService {
    apiClient: ApiClient = inject(ApiClient);
    baseUrl: string = "";

    constructor() {
        this.baseUrl = `${environment.baseUrl}/api`;
    }

    update(request: HumanUpdateRequest): Observable<string> {
        return this.apiClient.request<string>({
            path: `${this.baseUrl}/humans/${request.option}`,
            method: HttpMethod.PUT,
            body: request,
            headerResponse: true,
            responseType: "text"
        });
    }

    createProblem(characterId: string, humanId: string): Observable<HttpResponse<Problem>>;
    createProblem(characterId: string, humanId: string): Observable<HttpErrorResponse>;
    createProblem(characterId: string, humanId: string): Observable<HttpResponse<Problem>> | Observable<HttpErrorResponse> {
        return this.apiClient.request<HttpResponse<Problem>>({
            path: `${this.baseUrl}/humans/${characterId}/human/${humanId}/problem`,
            method: HttpMethod.POST,
            headerResponse: true,
        });
    }

    removeProblem(characterId: string, humanId: string, problemId: string): Observable<string>;
    removeProblem(characterId: string, humanId: string, problemId: string): Observable<HttpErrorResponse>;
    removeProblem(characterId: string, humanId: string, problemId: string): Observable<string> | Observable<HttpErrorResponse> {
        return this.apiClient.request<string>({
            path: `${this.baseUrl}/humans/${characterId}/human/${humanId}/problem/${problemId}`,
            method: HttpMethod.DELETE,
            headerResponse: true,
            responseType: "text"
        });
    }

    updateProblem(request: ProblemUpdateRequest): Observable<string>;
    updateProblem(request: ProblemUpdateRequest): Observable<string>;
    updateProblem(request: ProblemUpdateRequest): Observable<string> | Observable<HttpErrorResponse> {
        return this.apiClient.request<string>({
            path: `${this.baseUrl}/humans/problem/${request.problemOption}`,
            method: HttpMethod.PUT,
            body: request,
            headerResponse: true,
            responseType: "text"
        });
    }
}