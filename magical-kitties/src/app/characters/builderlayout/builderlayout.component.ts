import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { FooterComponent } from '../../layout/footer/footer.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { LayoutComponent } from '../../layout/layout.component';
import { Character } from '../../models/Characters/character.model';
import { UpdateCharacterDescriptors } from '../../models/Characters/updatecharacterdescriptors.model';
import { CharacterAPIService } from '../services/characters.service';

@Component({
    selector: 'app-builderlayout',
    imports: [CommonModule, RouterOutlet, MatToolbarModule, MatIconModule, HeaderComponent, FooterComponent, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatDividerModule],
    templateUrl: './builderlayout.component.html',
    styleUrl: './builderlayout.component.scss'
})
export class BuilderlayoutComponent extends LayoutComponent {
    router: Router = inject(Router);
    //route: ActivatedRoute = inject(ActivatedRoute);
    characterApi: CharacterAPIService = inject(CharacterAPIService);
    characterId: string;
    nameInput: FormControl = new FormControl("", [Validators.required]);
    currentPage?: string;
    character?: Character;

    constructor() {
        super();
        this.characterId = this.route.snapshot.params["id"];

        this.characterApi.getCharacterInformation(this.characterId).subscribe({
            next: (character: Character) => {
                this.characterApi.addCharacter(character);
                this.nameInput.setValue(character.name);
            }
        });

        this.router.events
            .pipe(
                filter((e) => e instanceof RouterEvent)
            )
            .subscribe({
                next: (event) => {
                    this.currentPage = event.url.split('/').at(-1);
                }
            });

        this.characterApi.character$.subscribe({
            next: (character: Character | undefined) => {
                this.character = character;
            }
        })
    }

    updateName(): void {
        const payload: UpdateCharacterDescriptors = {
            characterId: this.character!.id,
            name: this.nameInput.value,
        };

        this.characterApi.updateName(payload).subscribe({
            next: (response) => {
                this.character!.name = this.nameInput.value;
            },
            error: (err) => {
                console.log("Name update error: " + err);
            }
        })
    }

    navigate(page: string) {
        this.router.navigate([page], { relativeTo: this.route });
    }
}
