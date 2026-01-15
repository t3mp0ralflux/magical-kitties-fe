import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AttributeOption } from '../../../models/Characters/attributeoption.model';
import { Character } from '../../../models/Characters/character.model';
import { CharacterAPIService } from '../../services/characters.service';

@Component({
    selector: 'app-stat-bubble',
    imports: [CommonModule],
    templateUrl: './stat-bubble.component.html',
    styleUrl: './stat-bubble.component.scss',
})
export class StatBubbleComponent implements OnInit, OnDestroy {
    @Input() option!: AttributeOption;
    character?: Character;
    characterService: CharacterAPIService = inject(CharacterAPIService);
    AttributeOption = AttributeOption;
    displayedValue = 0;
    subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.subscriptions.push(this.characterService.characterChanged$.subscribe({
            next: (update) => {
                if (update.attributeOption === AttributeOption.currentinjuries) {
                    this.updateValues();
                }
            }
        }));

        this.subscriptions.push(this.characterService.character$.subscribe({
            next: (character: Character | undefined) => {
                this.character = character;
            }
        }));
    }

    ngAfterContentInit(): void {
        this.updateValues();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        })
    }

    updateValues(): void {
        switch (this.option) {
            case AttributeOption.cute:
                this.displayedValue = this.character!.cuteDisplay;
                break;
            case AttributeOption.cunning:
                this.displayedValue = this.character!.cunningDisplay;
                break;
            case AttributeOption.fierce:
                this.displayedValue = this.character!.fierceDisplay;
                break;
        }
    }
}
