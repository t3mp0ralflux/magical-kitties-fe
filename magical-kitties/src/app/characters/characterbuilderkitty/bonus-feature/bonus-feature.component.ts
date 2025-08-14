import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AttributeOption } from '../../../models/Characters/attributeoption.model';
import { Character } from '../../../models/Characters/character.model';
import { Endowment } from '../../../models/Characters/endowment.model';
import { Upgrade } from '../../../models/Characters/upgrade.model';
import { UpgradeOption } from '../../../models/Characters/upgradeoption.model';
import { UpgradeRemoveRequest } from '../../../models/Characters/upgraderemoverequest.model';
import { UpsertUpgradeRequest } from '../../../models/Characters/upsertupgraderequest.model';
import { UpgradeRule } from '../../../models/System/upgraderule.model';
import { CharacterAPIService } from '../../services/characters.service';
import { BonusFeatureUpgrade } from './models/bonus-feature.model';

@Component({
    selector: 'app-bonus-feature',
    imports: [CommonModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule, MatCheckboxModule],
    templateUrl: './bonus-feature.component.html',
    styleUrl: './bonus-feature.component.scss'
})
export class BonusFeatureComponent implements AfterContentInit {
    @Input() id?: string;
    @Input() parentControl!: any;
    @Input() disabled!: boolean;
    @Output() upgradeSelected = new EventEmitter<boolean>();
    showOptions: Boolean = true;
    characterApi: CharacterAPIService = inject(CharacterAPIService);
    upgradeRule?: UpgradeRule;
    private upgradeInformation?: Upgrade;
    private bonusFeatureInformation?: BonusFeatureUpgrade;
    magicalPowerChoice: FormControl = new FormControl({ value: undefined, disabled: this.disabled })
    bonusFeatureChoice: FormControl = new FormControl({ value: undefined, disabled: this.disabled })
    private character?: Character;

    get characterCurrentPowers() {
        return this.character?.magicalPowers;
    }

    constructor() {
        this.characterApi.character$.subscribe({
            next: (character) => {
                if (character) {
                    this.character = character;
                }
            }
        });
    }

    get bonusFeatures() {
        const foundMagicalPower = this.characterApi.rules?.magicalPowers.find(x => x.id === this.magicalPowerChoice.value);
        return foundMagicalPower?.bonusFeatures;
    }

    ngAfterContentInit(): void {
        this.upgradeInformation = this.character?.upgrades.find(x => x.id === this.id);

        this.upgradeRule = this.characterApi.rules?.upgrades.find(x => x.id === this.id);

        if (this.upgradeInformation?.choice) {
            this.bonusFeatureInformation = this.upgradeInformation.choice as BonusFeatureUpgrade;
            this.magicalPowerChoice.setValue(this.bonusFeatureInformation?.magicalPowerId);
        }
    }

    checkChange(event: MatCheckboxChange) {
        if (event.checked) {
            const newUpgrade = new Upgrade({ id: this.id, option: AttributeOption.magicalpowerbonus, block: this.upgradeRule!.block });
            const upgradeRequest = new UpsertUpgradeRequest({ upgradeId: this.id, upgradeOption: UpgradeOption.bonusFeature, attributeOption: AttributeOption.magicalpowerbonus, block: this.upgradeRule!.block });
            this.characterApi.upsertUpgrade(this.character!.id, upgradeRequest).subscribe({
                next: (value: string) => {
                    this.character!.upgrades.push(newUpgrade);
                },
                error: (err) => {
                    debugger;
                    // TODO: do something?
                }
            });
        } else {
            const existingUpgrade = this.character?.upgrades.find(x => x.id === this.id);
            if (!existingUpgrade) {
                return;
            }

            const upgradeRemoveRequest = new UpgradeRemoveRequest({ upgradeId: this.id, upgradeOption: UpgradeOption.bonusFeature })
            this.characterApi.removeUpgrade(this.character!.id, upgradeRemoveRequest).subscribe({
                next: (value: string) => {
                    const upgradeIndex = this.character?.upgrades.findIndex(x => x.id === existingUpgrade.id);
                    if (upgradeIndex !== undefined && upgradeIndex >= 0) {
                        this.character!.upgrades.splice(upgradeIndex, 1);
                        this.magicalPowerChoice.setValue(undefined);
                    }
                },
                error: (err) => {
                    debugger;
                }
            });

        }


        this.upgradeSelected.next(event.checked);
    }

    changeMagicalPower(value: MatSelectChange) {
        if (!this.bonusFeatureInformation) {
            this.bonusFeatureInformation = new BonusFeatureUpgrade();
        }

        this.bonusFeatureInformation.magicalPowerId = value.value;
        this.bonusFeatureInformation.bonusFeatureId = undefined; // reset this cause it's wrong.

        if (!this.upgradeInformation) {
            this.upgradeInformation = new Upgrade({ id: this.id, option: AttributeOption.magicalpowerbonus })
        }

        this.upgradeInformation!.choice = this.bonusFeatureInformation;

        const upgradeRequest = new UpsertUpgradeRequest({ upgradeId: this.id, upgradeOption: UpgradeOption.bonusFeature, attributeOption: AttributeOption.magicalpower, block: this.upgradeRule!.block, value: JSON.stringify(this.bonusFeatureInformation) });

        this.characterApi.upsertUpgrade(this.character!.id, upgradeRequest).subscribe({
            next: (_: string) => {
                let existingUpgrade = this.character!.upgrades.find(x => x.id === this.id);
                if (existingUpgrade) {
                    existingUpgrade = this.upgradeInformation;
                }
                //this.magicalPowerChoice.setValue(value.value);
            },
            error: (err) => {
                debugger;
            }
        })
    }

    changeBonusFeature(value: MatSelectChange) {
        if (!this.bonusFeatureInformation) {
            this.bonusFeatureInformation = new BonusFeatureUpgrade();
        }

        this.bonusFeatureInformation.bonusFeatureId = value.value;

        if (!this.upgradeInformation) {
            this.upgradeInformation = new Upgrade({ id: this.id, option: AttributeOption.magicalpowerbonus })
        }

        this.upgradeInformation!.choice = this.bonusFeatureInformation;

        // TODO: persist changes to db here.
    }

    getAvailableBonusFeatures(): Endowment[] {
        let result: Endowment[] = [];
        const foundMagicalPower = this.characterApi.rules?.magicalPowers.find(x => x.id === this.magicalPowerChoice.value);
        if (!foundMagicalPower) {
            return result;
        }

        result = foundMagicalPower.bonusFeatures;

        const relevantUpgrades = this.character?.upgrades.filter(x => x.option === AttributeOption.magicalpowerbonus);
        if (relevantUpgrades) {
            relevantUpgrades.forEach((upgrade) => {
                const choice = upgrade.choice as BonusFeatureUpgrade;

                if (choice) {
                    const bonusIndex = result.findIndex(x => x.id === choice.bonusFeatureId);

                    if (bonusIndex > 0) {
                        result.splice(bonusIndex, 1);
                    }
                }
            })
        }

        return result;
    }
}
