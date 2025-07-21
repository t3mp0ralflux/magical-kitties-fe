import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { AttributeOption } from "../../models/Characters/attributeoption.model";
import { Character } from "../../models/Characters/character.model";
import { CharactersResponse } from "../../models/Characters/charactersresponse.model";
import { DescriptionOption } from "../../models/Characters/descriptionoption.model";
import { UpdateCharacterAttributes } from "../../models/Characters/updateacharacterattributes.model";
import { UpdateCharacterDescriptors } from "../../models/Characters/updatecharacterdescriptors.model";
import { ApiClient, HttpMethod } from "../../services/apiClient.service";

@Injectable({ providedIn: "root" })
export class CharacterAPIService {
    apiClient: ApiClient = inject(ApiClient);
    baseUrl: string = "";
    private character: BehaviorSubject<Character | undefined> = new BehaviorSubject<Character | undefined>(undefined);
    private levelUpSubject: Subject<number> = new Subject<number>();
    levelUp$: Observable<number> = this.levelUpSubject.asObservable();

    constructor() {
        this.baseUrl = `${environment.baseUrl}/api`;
    }

    getCharacters(sortOption: string, searchValue?: string): Observable<CharactersResponse> {
        let endpoint = `characters?sortBy=${sortOption}`;
        if (searchValue) {
            endpoint = `${endpoint}&searchInput=${searchValue}`
        }

        return this.apiClient.request<CharactersResponse>({
            path: `${this.baseUrl}/${endpoint}`,
            method: HttpMethod.GET
        });
    }

    addCharacter(character: Character) {
        this.character.next(character);
    }

    get character$() {
        return this.character.asObservable();
    }

    getCharacterInformation(characterId: string) {
        return this.apiClient.request<Character>({
            path: `${this.baseUrl}/characters/${characterId}`,
            method: HttpMethod.GET
        });
    }

    createCharacter(): Observable<HttpResponse<Character>>;
    createCharacter(): Observable<HttpErrorResponse>;
    createCharacter(): Observable<HttpResponse<Character>> | Observable<HttpErrorResponse> {
        return this.apiClient.request<HttpResponse<Character>>({
            path: `${this.baseUrl}/characters`,
            headerResponse: true,
        });
    }

    copyCharacter(characterId: string): Observable<HttpResponse<Character>>;
    copyCharacter(characterId: string): Observable<HttpErrorResponse>;
    copyCharacter(characterId: string): Observable<HttpResponse<Character>> | Observable<HttpErrorResponse> {
        return this.apiClient.request<HttpResponse<Character>>({
            path: `${this.baseUrl}/characters/${characterId}`,
            method: HttpMethod.POST,
            headerResponse: true,
        });
    }

    deleteCharacter(characterId: string): Observable<HttpResponse<any>>;
    deleteCharacter(characterId: string): Observable<HttpErrorResponse>;
    deleteCharacter(characterId: string): Observable<HttpResponse<any>> | Observable<HttpErrorResponse> {
        return this.apiClient.request<HttpResponse<any>>({
            path: `${this.baseUrl}/characters/${characterId}`,
            method: HttpMethod.DELETE
        });
    }

    updateName(payload: UpdateCharacterDescriptors): Observable<string> {
        return this.apiClient.request<any>({
            path: `${this.baseUrl}/characters/description/${DescriptionOption.name}`,
            method: HttpMethod.PUT,
            body: payload,
            headerResponse: true,
            responseType: "text"
        });
    }

    /**
     * Updates the level of the character and sends out signal to anyone listening for an update.
     * @param payload 
     * @returns 
     */
    updateLevel(payload: UpdateCharacterAttributes): Observable<string> {
        return this.apiClient.request<any>({
            path: `${this.baseUrl}/characters/attributes/${AttributeOption.level}`,
            method: HttpMethod.PUT,
            body: payload,
            headerResponse: true,
            responseType: "text"
        }).pipe(
            tap(_ => this.levelUpSubject.next(payload.level!))
        );
    }

    updateXP(payload: UpdateCharacterAttributes): Observable<string> {
        return this.apiClient.request<any>({
            path: `${this.baseUrl}/characters/attributes/${AttributeOption.xp}`,
            method: HttpMethod.PUT,
            body: payload,
            headerResponse: true,
            responseType: "text"
        });
    }
}