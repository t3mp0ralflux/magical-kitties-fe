import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink } from '@angular/router';
import { MarkdownComponent } from "ngx-markdown";
import { Observable, Subscription } from 'rxjs';
import { AttributeOption } from '../../models/Characters/attributeoption.model';
import { Character } from '../../models/Characters/character.model';
import { Problem } from '../../models/Characters/problem.model';
import { UpgradeOption } from '../../models/Characters/upgradeoption.model';
import { AuthService } from '../../services/authService.service';
import { ConfirmModalComponent } from '../../sharedcomponents/confirm-modal/confirm-modal.component';
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
    imports: [CommonModule, StatBubbleComponent, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTabsModule, MatSidenavModule, MarkdownComponent, OwiesComponent, InjuriesComponent, KittyTreatsComponent, XpComponent, LevelInfogramComponent, RouterLink, MatExpansionModule],
    templateUrl: './displaycharacter.component.html',
    styleUrl: './displaycharacter.component.scss'
})
export class DisplayCharacterComponent implements OnInit, OnDestroy {
    characterService: CharacterAPIService = inject(CharacterAPIService);
    authService: AuthService = inject(AuthService);
    AttributeOption = AttributeOption;
    character?: Character;
    subscriptions: Subscription[] = [];
    router = inject(Router);
    dialog: MatDialog = inject(MatDialog);

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

    endScene(): void {
        const dialogData = { message: "Ending the scene will reset all Injuries, Owies, and Kitty treats to their default values. Are you sure you want to do this?" };

        const dialogSubscription = this.dialog.open(ConfirmModalComponent, { data: dialogData }).afterClosed().subscribe({
            next: (result) => {
                if (result) {
                    this.submitReset().subscribe({
                        next: (_ => {
                            this.characterService.getCharacterInformation(this.character!.id).subscribe();
                        })
                    });
                }
            },
            error: (err) => {
            }
        });

        this.subscriptions.push(dialogSubscription);
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

    getParsedProblemText(problem: Problem): string {
        const actualSource = problem.customSource ??= problem.source;
        const actualEmotion = problem.customEmotion ??= problem.emotion;
        const verb = !problem.solved ? "is making them feel" : "made them feel";

        return `${actualSource} ${verb} ${actualEmotion}.`;
    }

    toggleHelp(): void {
        document.getElementById("help")?.classList.toggle("invisible");
        // document.getElementById("help-bg")?.classList.toggle("opacity-50");
        // document.getElementById("help-bg")?.classList.toggle("opacity-0");
        document.getElementById("help")?.classList.toggle("-translate-y-full");
        //document.getElementById("test")?.classList.toggle("-translate-y-full");
        document.getElementById("help")?.classList.toggle("-translate-x-full");
        //document.getElementById("test")?.classList.toggle("-translate-x-full");

        const div = document.getElementById("test");
        if (div) {
            if (div.classList.contains('invisible')) {
                div.classList.remove('invisible');
            } else {
                div.classList.add('invisible');
            }
        }
    }

    toggleAnimation(): void {
        const div = document.getElementById('test');
        if (div) {
            if (div.classList.contains('opacity-100')) {
                // Ease out (move down and right, fade out)
                div.classList.remove('opacity-100', 'translate-x-0', 'translate-y-0');
                div.classList.add('opacity-0', 'translate-x-full', 'translate-y-full');
            } else {
                // Ease in (return to original position and become visible)
                div.classList.remove('opacity-0', 'translate-x-full', 'translate-y-full');
                div.classList.add('opacity-100', 'translate-x-0', 'translate-y-0');
            }
        }
    }
    toggleAnimation2(): void {
        const div = document.getElementById('test');
        if (div) {
            if (div.classList.contains('scale-0')) {
                div.classList.remove('scale-0');
                div.classList.add('scale-100');
            } else {
                div.classList.remove('scale-100');
                div.classList.add('scale-0');
            }
        }
    }

    private submitReset(): Observable<HttpResponse<any>> {
        return this.characterService.resetCharacter(this.character!.id);
    }
}
