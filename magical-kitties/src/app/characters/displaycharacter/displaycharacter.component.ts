import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MarkdownComponent } from "ngx-markdown";
import { Subscription } from 'rxjs';
import { AttributeOption } from '../../models/Characters/attributeoption.model';
import { Character } from '../../models/Characters/character.model';
import { UpgradeOption } from '../../models/Characters/upgradeoption.model';
import { AuthService } from '../../services/authService.service';
import { BonusFeatureUpgrade } from '../characterbuilderkitty/bonus-feature/models/bonus-feature.model';
import { CharacterAPIService } from '../services/characters.service';
import { InjuriesComponent } from "./injuries/injuries.component";
import { KittyTreatsComponent } from "./kitty-treats/kitty-treats.component";
import { LevelInfogramComponent } from "./level-infogram/level-infogram.component";
import { OwiesComponent } from "./owies/owies.component";
import { StatBubbleComponent } from "./stat-bubble/stat-bubble.component";
import { XpComponent } from './xp/xp.component';

@Component({
    selector: 'app-displaycharacter',
    imports: [StatBubbleComponent, MatButtonModule, MatFormFieldModule, MatInputModule, MarkdownComponent, OwiesComponent, InjuriesComponent, KittyTreatsComponent, XpComponent, LevelInfogramComponent],
    templateUrl: './displaycharacter.component.html',
    styleUrl: './displaycharacter.component.scss'
})
export class DisplayCharacterComponent implements OnInit, OnDestroy {
    characterService: CharacterAPIService = inject(CharacterAPIService);
    authService: AuthService = inject(AuthService);
    AttributeOption = AttributeOption;
    character?: Character;
    subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.subscriptions.push(this.characterService.character$.subscribe({
            next: (character: Character | undefined) => {
                this.character = character;
            }
        }));

        this.characterService.getRules().subscribe();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }

    getTalentInformation(): string {
        let output = "";
        this.character?.talents.forEach(talent => {
            output = `${output}
            #### ${talent.name}
              - ${talent.description}
            `;
        });

        return output;
    }

    getMagicalPowerInformation(): string {
        let output = "";
        const magicPowerUpgrades = this.character?.upgrades.filter(x => x.option === UpgradeOption.bonusFeature);

        this.character?.magicalPowers.forEach(power => {
            output = `${output}
            #### ${power.name}
              - ${power.description}
            `;

            if (magicPowerUpgrades) {
                const relevantUpgrades = magicPowerUpgrades?.filter(x => (x.choice as BonusFeatureUpgrade).magicalPowerId === power.id);

                if (relevantUpgrades.length > 0) {
                    output = `${output}
                #### Bonus Features`;

                    relevantUpgrades.forEach(upgrade => {
                        const bonusFeature = power.bonusFeatures.find(x => x.id === (upgrade.choice as BonusFeatureUpgrade).bonusFeatureId);

                        output = `${output}
                _${bonusFeature?.name}_
                  - ${bonusFeature?.description}\n`
                    });
                }
            }
        });

        return output;
    }

    getFlawInformation(): string {
        return `
        #### ${this.character?.flaw?.name}
        - ${this.character?.flaw?.description}`;

    }

}
