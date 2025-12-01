import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, debounceTime, EMPTY, Observable, switchMap } from 'rxjs';
import { getValue } from '../../login/utilities';
import { CharactersResponse } from '../../models/Characters/charactersresponse.model';
import { GetAllCharactersResponse } from '../../models/Characters/getallcharactersresponse.model';
import { NavigationExtras } from '../../models/Login/navigationExtras.model';
import { AuthService } from '../../services/authService.service';
import { trackByFn } from '../../utilities';
import { CharacterAPIService } from '../services/characters.service';
import { CopyCharacterModalComponent } from './copy-modal/copy-modal.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
@Component({
    selector: 'app-viewcharacters',
    imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSelectModule, MatDividerModule],
    templateUrl: './viewcharacters.component.html',
    styleUrl: './viewcharacters.component.scss',
})
export class ViewCharactersComponent {
    private router: Router = inject(Router);
    private authService: AuthService = inject(AuthService);
    private apiService: CharacterAPIService = inject(CharacterAPIService);
    dialog: MatDialog = inject(MatDialog);
    private refreshSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private searchText: BehaviorSubject<string> = new BehaviorSubject<string>("");
    private sortOption: BehaviorSubject<string> = new BehaviorSubject<string>("name");
    trackByFn = trackByFn;
    private searchInformation$: Observable<{ input: string, sort: string }> = combineLatest({ input: this.searchText, sort: this.sortOption, refresh: this.refreshSearch });

    getValue = getValue;
    isLoading = true;

    characters$: Observable<CharactersResponse> = this.searchInformation$.pipe(
        debounceTime(200),
        switchMap(characterSearch =>
            this.apiService.getCharacters(characterSearch.sort, characterSearch.input)
        ),
        catchError((err: any) => {
            //debugger;
            return EMPTY;
        })
    )

    constructor() {
        if (this.authService.account === undefined) {
            const extras = new NavigationExtras({
                resumeUrl: "characters",
                resumeNavigation: true
            });

            this.router.navigateByUrl("/login", { state: extras });
        }
    }

    search(characterSearch: string): void {
        this.searchText.next(characterSearch);
    }

    sort(event: MatSelectChange): void {
        this.sortOption.next(event.value);
    }

    createCharacter(): void {
        this.apiService.createCharacter().subscribe({
            next: (response) => {
                const characterLocation = response.headers.get("location")?.split("/") ?? [];
                const characterId = characterLocation![characterLocation!.length - 1];
                this.router.navigateByUrl(`/characters/${characterId}/builder/kitty`);
            },
            error: (err) => {
                // TODO: do something here.
            }
        })
    }

    viewCharacter(characterId: string): void {
        this.router.navigateByUrl(`/characters/${characterId}`);
    }

    editCharacter(characterId: string): void {
        this.router.navigateByUrl(`/characters/${characterId}/builder/kitty`);
    }

    copyCharacter(characterId: string): void {
        this.dialog.open(CopyCharacterModalComponent).afterClosed().subscribe({
            next: (value) => {
                if (!value) {
                    return;
                }

                this.apiService.copyCharacter(characterId).subscribe({
                    next: (response) => {
                        const characterLocation = response.headers.get("location")?.split("/") ?? [];
                        const characterId = characterLocation![characterLocation!.length - 1];
                        this.router.navigateByUrl(`/characters/${characterId}`);
                    }
                })
            }
        })
    }

    deleteCharacter(character: GetAllCharactersResponse): void {
        this.dialog.open(DeleteModalComponent, { data: character }).afterClosed().subscribe({
            next: (value) => {
                if (!value) {
                    return;
                }

                this.apiService.deleteCharacter(character.id).subscribe({
                    next: () => {
                        this.refreshSearch.next(true);
                    },
                    error: (err) => {
                        //debugger;
                    }
                })
            }
        })
    }
}
