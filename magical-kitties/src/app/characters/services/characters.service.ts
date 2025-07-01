import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Character } from "../../models/Characters/character.model";
import { CharactersResponse } from "../../models/Characters/charactersresponse.model";
import { ApiClient } from "../../services/apiClient.service";

@Injectable({ providedIn: "root" })
export class CharacterAPIService {
    apiClient: ApiClient = inject(ApiClient);
    baseUrl: string = "";

    constructor() {
        this.baseUrl = `${environment.baseUrl}/api`;
    }

    // register(request: AccountCreateRequest): Observable<Account>;
    // register(request: AccountCreateRequest): Observable<HttpErrorResponse>;
    // register(request: AccountCreateRequest): Observable<Account> | Observable<HttpErrorResponse> {
    //     return this.apiClient.post<Account>(`${this.baseUrl}/accounts`, request);
    // }
    getCharacters(sortOption: string, searchValue?: string): Observable<CharactersResponse> {
        let endpoint = `characters?sortBy=${sortOption}`;
        if (searchValue) {
            endpoint = `${endpoint}&searchInput=${searchValue}`
        }

        return this.apiClient.get(`${this.baseUrl}/${endpoint}`);
    }

    createCharacter(): Observable<HttpResponse<Character>>;
    createCharacter(): Observable<HttpErrorResponse>;
    createCharacter(): Observable<HttpResponse<Character>> | Observable<HttpErrorResponse> {
        return this.apiClient.post<HttpResponse<Character>>(`${this.baseUrl}/characters`, null, { observe: 'response' });
    }

    copyCharacter(characterId: string): Observable<HttpResponse<Character>>;
    copyCharacter(characterId: string): Observable<HttpErrorResponse>;
    copyCharacter(characterId: string): Observable<HttpResponse<Character>> | Observable<HttpErrorResponse> {
        return this.apiClient.post<HttpResponse<Character>>(`${this.baseUrl}/characters/${characterId}`, null, { observe: 'response' });
    }

    deleteCharacter(characterId: string): Observable<HttpResponse<any>>;
    deleteCharacter(characterId: string): Observable<HttpErrorResponse>;
    deleteCharacter(characterId: string): Observable<HttpResponse<any>> | Observable<HttpErrorResponse> {
        return this.apiClient.delete<HttpResponse<any>>(`${this.baseUrl}/characters/${characterId}`);
    }
}