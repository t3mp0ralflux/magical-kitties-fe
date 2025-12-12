import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { Character } from '../../../models/Characters/character.model';
import { Upgrade } from '../../../models/Characters/upgrade.model';
import { UpgradeRemoveRequest } from '../../../models/Characters/upgraderemoverequest.model';
import { UpsertUpgradeRequest } from '../../../models/Characters/upsertupgraderequest.model';
import { UpgradeRule } from '../../../models/System/upgraderule.model';
import { CharacterAPIService } from '../../services/characters.service';

@Component({
    selector: 'app-increase-limit',
    imports: [CommonModule, MatCheckboxModule, ReactiveFormsModule],
    templateUrl: './increase-limit.component.html',
    styleUrl: './increase-limit.component.scss'
})
export class IncreaseLimitComponent implements AfterContentInit, OnDestroy {
    @Input() id?: string;
    @Input() parentControl!: any;
    @Input() disabled!: boolean;
    @Output() upgradeSelected = new EventEmitter<boolean>();
    showOptions: Boolean = false;
    characterApi: CharacterAPIService = inject(CharacterAPIService);
    private character?: Character;
    upgradeRule?: UpgradeRule;
    characterSubscription?: Subscription;

    constructor() {
        this.characterSubscription = this.characterApi.character$.subscribe({
            next: (character) => {
                this.character = character;
            }
        });
    }

    ngAfterContentInit(): void {
        this.upgradeRule = this.characterApi.rules?.upgrades.find(x => x.id === this.id);
    }

    ngOnDestroy(): void {
        if (this.characterSubscription) {
            this.characterSubscription.unsubscribe();
        }
    }

    checkChange(event: MatCheckboxChange): void {
        if (event.checked) {
            const newUpgrade = new Upgrade({ id: this.id, option: this.upgradeRule!.upgradeOption, block: this.upgradeRule!.block });
            const upgradeRequest = new UpsertUpgradeRequest({ upgradeId: this.id, upgradeOption: this.upgradeRule!.upgradeOption, block: this.upgradeRule!.block });

            this.characterApi.upsertUpgrade(this.character!.id, upgradeRequest).subscribe({
                next: (_: string) => {
                    this.character!.upgrades.push(newUpgrade);
                },
                error: (err) => {
                    // TODO: do something?
                }
            })
        } else {
            const existingUpgrade = this.character?.upgrades.find(x => x.id === this.id);
            if (!existingUpgrade) {
                return;
            }

            const upgradeRemoveRequest = new UpgradeRemoveRequest({ upgradeId: this.id, upgradeOption: this.upgradeRule!.upgradeOption });
            this.characterApi.removeUpgrade(this.character!.id, upgradeRemoveRequest).subscribe({
                next: (_: string) => {
                    const upgradeIndex = this.character?.upgrades.findIndex(x => x.id === existingUpgrade.id);
                    if (upgradeIndex !== undefined && upgradeIndex >= 0) {
                        this.character!.upgrades.splice(upgradeIndex, 1);
                    }
                    this.showOptions = false;
                },
                error: (err) => {
                    // TODO: do something?
                }
            });
        }

        this.upgradeSelected.next(event.checked);
    }
}
