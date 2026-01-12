import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { DebounceClickDirective } from "../../../directives/debounce-click.directive";
import { Character } from '../../../models/Characters/character.model';
import { UpdateCharacterAttributes } from '../../../models/Characters/updateacharacterattributes.model';
import { UpgradeOption } from '../../../models/Characters/upgradeoption.model';
import { AuthService } from '../../../services/authService.service';
import { CharacterAPIService } from '../../services/characters.service';

@Component({
    selector: 'app-owies',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, DebounceClickDirective],
    templateUrl: './owies.component.html',
    styleUrl: './owies.component.scss',
})
export class OwiesComponent {
    characterService: CharacterAPIService = inject(CharacterAPIService);
    authService: AuthService = inject(AuthService);
    character?: Character;
    characterSubscription!: Subscription;

    ngOnInit(): void {
        this.characterSubscription = this.characterService.character$.subscribe({
            next: (character: Character | undefined) => {
                if (character) {
                    const owieIncrease = character?.upgrades.filter(x => x.option === UpgradeOption.owieLimit);
                    character!.maxOwies += owieIncrease?.length;

                    this.character = character;
                }
            }
        });
    }

    clickedItem(itemClicked: number): void {
        if (!this.character) {
            return;
        }

        if (itemClicked > this.character.currentOwies) {
            this.character.currentOwies += 1;
        } else {
            this.character.currentOwies -= 1;
        }

        const payload: UpdateCharacterAttributes = {
            characterId: this.character.id,
            currentOwies: this.character.currentOwies,
        }

        this.characterService.updateOwies(payload).subscribe({
            next: (_) => {
            },
            error: () => {
            }
        });
    }
}
