import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { DebounceClickDirective } from "../../../directives/debounce-click.directive";
import { AttributeOption } from '../../../models/Characters/attributeoption.model';
import { Character } from '../../../models/Characters/character.model';
import { UpdateCharacterAttributes } from '../../../models/Characters/updateacharacterattributes.model';
import { CharacterUpdate } from '../../../models/System/characterupdate.model';
import { AuthService } from '../../../services/authService.service';
import { CharacterAPIService } from '../../services/characters.service';

@Component({
    selector: 'app-injuries',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, DebounceClickDirective, MatExpansionModule],
    templateUrl: './injuries.component.html',
    styleUrl: './injuries.component.scss',
})
export class InjuriesComponent {
    characterService: CharacterAPIService = inject(CharacterAPIService);
    authService: AuthService = inject(AuthService);
    character?: Character;
    characterSubscription!: Subscription;

    ngOnInit(): void {
        this.characterSubscription = this.characterService.character$.subscribe({
            next: (character: Character | undefined) => {
                if (character) {
                    this.character = character;
                }
            }
        });
    }

    clickedItem(itemClicked: number): void {
        if (!this.character) {
            return;
        }

        if (itemClicked > this.character.currentInjuries) {
            this.character.currentInjuries += 1;
        } else {
            this.character.currentInjuries -= 1;
        }

        const payload: UpdateCharacterAttributes = {
            characterId: this.character.id,
            currentInjuries: this.character.currentInjuries,
        }

        this.characterService.updateAttribute(AttributeOption.currentinjuries, payload).subscribe({
            next: (_) => {
                this.characterService.characterHasChanged(new CharacterUpdate({ attributeOption: AttributeOption.currentinjuries }));
            },
            error: () => {
            }
        });
    }

    updateIncapacitation(): void {
        if (!this.character) {
            return;
        }

        this.character.incapacitated = !this.character.incapacitated

        const payload: UpdateCharacterAttributes = {
            characterId: this.character.id,
            incapacitated: this.character.incapacitated
        };

        this.characterService.updateAttribute(AttributeOption.incapacitated, payload).subscribe({
            next: () => {
                this.characterService.characterHasChanged(new CharacterUpdate({ attributeOption: AttributeOption.incapacitated }));
            }
        })
    }
}
