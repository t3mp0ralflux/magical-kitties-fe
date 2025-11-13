import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { AttributeOption } from "../../models/Characters/attributeoption.model";
import { Character } from "../../models/Characters/character.model";
import { CharactersResponse } from "../../models/Characters/charactersresponse.model";
import { DescriptionOption } from "../../models/Characters/descriptionoption.model";
import { DescriptionUpdateRequest } from "../../models/Characters/descriptionupdaterequest.model";
import { Human } from "../../models/Characters/human.model";
import { UpdateCharacterAttributes } from "../../models/Characters/updateacharacterattributes.model";
import { UpdateCharacterDescriptors } from "../../models/Characters/updatecharacterdescriptors.model";
import { UpgradeRemoveRequest } from "../../models/Characters/upgraderemoverequest.model";
import { UpsertUpgradeRequest } from "../../models/Characters/upsertupgraderequest.model";
import { CharacterUpdate } from "../../models/System/characterupdate.model";
import { Rules } from "../../models/System/rules.model";
import { ApiClient, HttpMethod } from "../../services/apiClient.service";

@Injectable({ providedIn: "root" })
export class CharacterAPIService {
    apiClient: ApiClient = inject(ApiClient);
    baseUrl: string = "";
    private character: BehaviorSubject<Character | undefined> = new BehaviorSubject<Character | undefined>(undefined);
    private characterChangedSubject: Subject<CharacterUpdate> = new Subject<CharacterUpdate>();
    characterChanged$: Observable<CharacterUpdate> = this.characterChangedSubject.asObservable();
    rules?: Rules;

    constructor() {
        this.baseUrl = `${environment.baseUrl}/api`;
    }

    getRules(): Observable<Rules> {
        return this.apiClient.request<Rules>({
            path: `${this.baseUrl}/rules`,
            method: HttpMethod.GET
        }).pipe(
            tap(x => this.rules = x)
        );
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

    characterHasChanged(payload: CharacterUpdate): void {
        this.characterChangedSubject.next(payload);
    }

    getCharacterInformation(characterId: string) {
        return this.apiClient.request<Character>({
            path: `${this.baseUrl}/characters/${characterId}`,
            method: HttpMethod.GET
        }).pipe(
            tap(character => this.character.next(character))
        );
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
        }).pipe(
            tap(_ => {
                const returnInfo = new CharacterUpdate({
                    descriptionOption: DescriptionOption.name,
                    value: payload.name
                });

                this.characterChangedSubject.next(returnInfo);
            })
        );
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
        });
    }

    updateAttribute(payload: UpdateCharacterAttributes, choice: AttributeOption): Observable<string> {
        return this.apiClient.request<any>({
            path: `${this.baseUrl}/characters/attributes/${choice}`,
            method: HttpMethod.PUT,
            body: payload,
            headerResponse: true,
            responseType: "text"
        });
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

    updateFlaw(payload: UpdateCharacterAttributes): Observable<string> {
        return this.apiClient.request<string>({
            path: `${this.baseUrl}/characters/attributes/${AttributeOption.flaw}`,
            method: HttpMethod.PUT,
            body: payload,
            headerResponse: true,
            responseType: "text"
        });
    }

    updateTalent(payload: UpdateCharacterAttributes): Observable<string> {
        return this.apiClient.request<string>({
            path: `${this.baseUrl}/characters/attributes/${AttributeOption.talent}`,
            method: HttpMethod.PUT,
            body: payload,
            headerResponse: true,
            responseType: "text"
        });
    }

    updateMagicalPower(payload: UpdateCharacterAttributes): Observable<string> {
        return this.apiClient.request<string>({
            path: `${this.baseUrl}/characters/attributes/${AttributeOption.magicalpower}`,
            method: HttpMethod.PUT,
            body: payload,
            headerResponse: true,
            responseType: "text"
        });
    }

    upsertUpgrade(characterId: string, upgrade: UpsertUpgradeRequest): Observable<string> {
        return this.apiClient.request<string>({
            path: `${this.baseUrl}/characters/${characterId}/upgrade/upsert`,
            method: HttpMethod.PUT,
            body: upgrade,
            headerResponse: true,
            responseType: "text"
        });
    }

    removeUpgrade(characterId: string, upgrade: UpgradeRemoveRequest): Observable<string> {
        return this.apiClient.request<string>({
            path: `${this.baseUrl}/characters/${characterId}/upgrade/remove`,
            method: HttpMethod.PUT,
            body: upgrade,
            headerResponse: true,
            responseType: "text"
        });
    }

    updateDescription(option: DescriptionOption, payload: DescriptionUpdateRequest): Observable<string> {
        return this.apiClient.request<string>({
            path: `${this.baseUrl}/characters/description/${option}`,
            method: HttpMethod.PUT,
            body: payload,
            headerResponse: true,
            responseType: "text"
        });
    }

    addHuman(characterId: string): Observable<HttpResponse<Human>>;
    addHuman(characterId: string): Observable<HttpErrorResponse>;
    addHuman(characterId: string): Observable<HttpResponse<Human>> | Observable<HttpErrorResponse> {
        return this.apiClient.request<HttpResponse<Human>>({
            path: `${this.baseUrl}/humans/${characterId}`,
            method: HttpMethod.POST,
            headerResponse: true,
        });
    }

    removeHuman(characterId: string, humanId: string): Observable<unknown> {
        return this.apiClient.request({
            path: `${this.baseUrl}/humans/${characterId}/human/${humanId}`,
            method: HttpMethod.DELETE,
            responseType: "application/json"
        });
    }
}