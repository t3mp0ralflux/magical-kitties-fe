import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { Subscription } from 'rxjs';
import { AttributeOption } from '../../models/Characters/attributeoption.model';
import { Character } from '../../models/Characters/character.model';
import { CharacterUpdate } from '../../models/System/characterupdate.model';
import { AuthService } from '../../services/authService.service';
import { CharacterAPIService } from '../services/characters.service';
import { StatBubbleComponent } from "./stat-bubble/stat-bubble.component";

@Component({
    selector: 'app-displaycharacter',
    imports: [StatBubbleComponent, MatButtonModule],
    templateUrl: './displaycharacter.component.html',
    styleUrl: './displaycharacter.component.scss'
})
export class DisplayCharacterComponent implements OnInit, OnDestroy {
    characterService: CharacterAPIService = inject(CharacterAPIService);
    authService: AuthService = inject(AuthService);
    AttributeOption = AttributeOption;
    character?: Character;
    characterSubscription!: Subscription;

    ngOnInit(): void {
        this.characterService.character$.subscribe({
            next: (character: Character | undefined) => {
                this.character = character;
            }
        });
    }

    ngOnDestroy(): void {
        if (this.characterSubscription) {
            this.characterSubscription.unsubscribe();
        }
    }

    addInjury(): void {
        // TODO: REMOVE THIS!
        this.character!.currentInjuries += 1;

        this.characterService.characterHasChanged(new CharacterUpdate({
            attributeOption: AttributeOption.currentinjuries
        }));
    }

    removeInjury(): void {
        // TODO: REMOVE THIS!
        if (this.character!.currentInjuries > 0) {
            this.character!.currentInjuries -= 1;
        }

        this.characterService.characterHasChanged(new CharacterUpdate({
            attributeOption: AttributeOption.currentinjuries
        }));
    }

}
