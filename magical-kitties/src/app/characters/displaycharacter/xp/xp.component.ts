import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { DebounceClickDirective } from '../../../directives/debounce-click.directive';
import { AttributeOption } from '../../../models/Characters/attributeoption.model';
import { Character } from '../../../models/Characters/character.model';
import { UpdateCharacterAttributes } from '../../../models/Characters/updateacharacterattributes.model';
import { AuthService } from '../../../services/authService.service';
import { CharacterAPIService } from '../../services/characters.service';

@Component({
    selector: 'app-xp',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, DebounceClickDirective, MatExpansionModule],
    templateUrl: './xp.component.html',
    styleUrl: './xp.component.scss',
})
export class XpComponent {
    characterService: CharacterAPIService = inject(CharacterAPIService);
    authService: AuthService = inject(AuthService);
    character?: Character;
    characterSubscription!: Subscription;
    indexRange: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

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

        if (itemClicked > this.character.currentXp) {
            this.character.currentXp += 1;
        } else {
            this.character.currentXp -= 1;
        }

        const payload: UpdateCharacterAttributes = {
            characterId: this.character.id,
            xp: this.character.currentXp,
        }

        this.characterService.updateAttribute(AttributeOption.xp, payload).subscribe({
            next: (_) => {
            },
            error: () => {
            }
        });
    }

    shouldShowLevelUp(): string {
        let result = "";
        if (!this.character || !this.characterService.rules) {
            return result;
        }

        const requiredXP = this.characterService.rules?.levelExperiencePoints[this.character!.level];

        if (!requiredXP) {
            return result;
        }

        if (this.character!.currentXp >= requiredXP) {
            result = "animate-background bg-gradient-to-r from-green-300 via-blue-600 to-red-300 bg-[length:_400%_400%] [animation-duration:_6s] text-white";
        }

        return result;
    }
}
