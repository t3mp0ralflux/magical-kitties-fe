import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { CharactersResponse } from '../../models/Characters/charactersresponse.model';
import { GetAllCharactersResponse } from '../../models/Characters/getallcharactersresponse.model';
import { NavigationExtras } from '../../models/Login/navigationExtras.model';
import { AuthService } from '../../services/authService.service';
import { CharacterAPIService } from '../services/characters.service';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@Component({
    selector: 'app-viewcharacters',
    imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSelectModule, MatDividerModule],
    templateUrl: './viewcharacters.component.html',
    styleUrl: './viewcharacters.component.scss'
})
export class ViewCharactersComponent implements OnInit, OnDestroy {
    private router: Router = inject(Router);
    private authService: AuthService = inject(AuthService);
    private apiService: CharacterAPIService = inject(CharacterAPIService);
    dialog = inject(MatDialog);
    isLoading: boolean = false;
    sortOption: string = "name";
    loggedOutSubscription: Subscription;

    characters$: Observable<CharactersResponse> = this.apiService.getCharacters().pipe(
        map((response: CharactersResponse) => {
            return response;
        })
    )

    constructor() {
        this.loggedOutSubscription = this.authService.loggedOut.subscribe({
            next: () => {
                this.router.navigateByUrl("");
            }
        })
        if (this.authService.account === undefined) {
            const extras = new NavigationExtras({
                resumeUrl: "characters",
                resumeNavigation: true
            });

            this.router.navigateByUrl("/login", { state: extras });
        }
    }
    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        if (this.loggedOutSubscription) {
            this.loggedOutSubscription.unsubscribe();
        }
    }

    createCharacter(): void {
        this.apiService.createCharacter().subscribe({
            next: (response) => {
                const characterLocation = response.headers.get("location")?.split("/") ?? [];
                const characterId = characterLocation![characterLocation!.length - 1];
                this.router.navigateByUrl(`/characters/${characterId}`);
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
        this.router.navigateByUrl(`/characters/${characterId}/builder`);
    }

    copyCharacter(characterId: string): void {
        // TODO: copy a character
    }

    deleteCharacter(character: GetAllCharactersResponse): void {
        this.dialog.open(DeleteModalComponent, { data: character }).afterClosed().subscribe({
            next: (value) => {
                if (!value) {
                    return;
                }

                this.apiService.deleteCharacter(character.id).subscribe({
                    next: () => {
                        // TODO: refresh the page.
                    },
                    error: (err) => {
                        debugger;
                    }
                })
            }
        })
    }
}
