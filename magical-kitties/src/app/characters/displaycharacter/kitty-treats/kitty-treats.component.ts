import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { DebounceClickDirective } from '../../../directives/debounce-click.directive';
import { AttributeOption } from '../../../models/Characters/attributeoption.model';
import { Character } from '../../../models/Characters/character.model';
import { UpdateCharacterAttributes } from '../../../models/Characters/updateacharacterattributes.model';
import { AuthService } from '../../../services/authService.service';
import { CharacterAPIService } from '../../services/characters.service';

@Component({
    selector: 'app-kitty-treats',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, DebounceClickDirective],
    templateUrl: './kitty-treats.component.html',
    styleUrl: './kitty-treats.component.scss',
})
export class KittyTreatsComponent {
    characterService: CharacterAPIService = inject(CharacterAPIService);
    authService: AuthService = inject(AuthService);
    character?: Character;
    characterSubscription!: Subscription;
    indexRange: number[] = [1, 2, 3, 4, 5];

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

        let shouldSend = true;

        if (itemClicked <= this.character.remainingTreats) {
            this.character.usedTreats += 1;
            this.character.remainingTreats -= 1;
        } else {
            this.character.usedTreats -= 1;
            this.character.remainingTreats += 1;
        }

        if (this.character.remainingTreats > this.character.treatsDisplay) {
            this.character.remainingTreats = this.character.treatsDisplay;
            this.character.usedTreats = 0;
            shouldSend = false;
        }

        if (shouldSend) {

            const payload: UpdateCharacterAttributes = {
                characterId: this.character.id,
                usedTreats: this.character.usedTreats,
            }

            this.characterService.updateAttribute(AttributeOption.usedtreats, payload).subscribe({
                next: (_) => {
                },
                error: () => {
                }
            });
        }
    }
}
