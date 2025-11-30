import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AttributeOption } from '../../../models/Characters/attributeoption.model';
import { Character } from '../../../models/Characters/character.model';
import { Endowment } from '../../../models/Characters/endowment.model';
import { Upgrade } from '../../../models/Characters/upgrade.model';
import { UpgradeOption } from '../../../models/Characters/upgradeoption.model';
import { UpgradeRemoveRequest } from '../../../models/Characters/upgraderemoverequest.model';
import { UpsertUpgradeRequest } from '../../../models/Characters/upsertupgraderequest.model';
import { CharacterUpdate } from '../../../models/System/characterupdate.model';
import { UpgradeRule } from '../../../models/System/upgraderule.model';
import { trackByFn } from '../../../utilities';
import { CharacterAPIService } from '../../services/characters.service';
import { InformationDisplayComponent } from '../information-display/information-display.component';
import { BonusFeatureUpgrade } from './models/bonus-feature.model';

@Component({
    selector: 'app-bonus-feature',
    imports: [CommonModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule, MatCheckboxModule, MatIconModule],
    templateUrl: './bonus-feature.component.html',
    styleUrl: './bonus-feature.component.scss'
})
export class BonusFeatureComponent implements AfterContentInit {
    @Input() id?: string;
    @Input() parentControl!: any;
    @Input() disabled!: boolean;
    @Output() upgradeSelected = new EventEmitter<boolean>();
    showOptions: Boolean = false;
    characterApi: CharacterAPIService = inject(CharacterAPIService);
    dialog: MatDialog = inject(MatDialog);
    upgradeRule?: UpgradeRule;
    trackByFn = trackByFn;
    magicalPowerChoice: FormControl = new FormControl({ value: undefined, disabled: this.disabled })
    bonusFeatureChoice: FormControl = new FormControl({ value: undefined, disabled: this.disabled })
    private upgradeInformation?: Upgrade;
    private bonusFeatureInformation?: BonusFeatureUpgrade;
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
            this.bonusFeatureChoice.setValue(this.bonusFeatureInformation?.bonusFeatureId);
        }

        this.showOptions = this.parentControl.value === true;

        this.characterApi.characterChanged$.subscribe({
            next: (update: CharacterUpdate) => {
                if (update.attributeOption === undefined) {
                    return;
                }

                switch (update.attributeOption.valueOf()) {
                    case AttributeOption.level:
                        if (update.value === true) {
                            this.magicalPowerChoice.setValue(undefined);
                            this.bonusFeatureChoice.setValue(undefined);

                            this.showOptions = false;
                        }
                        break;
                    case AttributeOption.magicalpower:
                        if (this.bonusFeatureInformation?.magicalPowerId === update.value) {
                            this.magicalPowerChoice.setValue(undefined);
                            this.bonusFeatureChoice.setValue(undefined);
                            this.getAvailableBonusFeatures();
                        }
                        break;
                }
            }
        });
    }

    checkChange(event: MatCheckboxChange) {
        if (event.checked) {
            const newUpgrade = new Upgrade({ id: this.id, option: UpgradeOption.bonusFeature, block: this.upgradeRule!.block });
            const upgradeRequest = new UpsertUpgradeRequest({ upgradeId: this.id, upgradeOption: UpgradeOption.bonusFeature, block: this.upgradeRule!.block });
            this.characterApi.upsertUpgrade(this.character!.id, upgradeRequest).subscribe({
                next: (_: string) => {
                    this.character!.upgrades.push(newUpgrade);
                    this.showOptions = true;
                },
                error: (err) => {
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
                next: (_: string) => {
                    const upgradeIndex = this.character?.upgrades.findIndex(x => x.id === existingUpgrade.id);
                    if (upgradeIndex !== undefined && upgradeIndex >= 0) {
                        this.character!.upgrades.splice(upgradeIndex, 1);
                        this.magicalPowerChoice.setValue(undefined);
                        this.bonusFeatureChoice.setValue(undefined);
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

    changeMagicalPower(value: MatSelectChange): void {
        if (!this.bonusFeatureInformation) {
            this.bonusFeatureInformation = new BonusFeatureUpgrade();
        }

        this.bonusFeatureInformation.magicalPowerId = value.value;
        this.bonusFeatureInformation.bonusFeatureId = undefined; // reset this cause it's wrong.

        if (!this.upgradeInformation) {
            this.upgradeInformation = new Upgrade({ id: this.id, option: UpgradeOption.bonusFeature });
        }

        this.upgradeInformation!.choice = this.bonusFeatureInformation;

        const upgradeRequest = new UpsertUpgradeRequest({ upgradeId: this.id, upgradeOption: UpgradeOption.bonusFeature, block: this.upgradeRule!.block, value: JSON.stringify(this.bonusFeatureInformation) });

        this.characterApi.upsertUpgrade(this.character!.id, upgradeRequest).subscribe({
            next: (_: string) => {
                let existingUpgrade = this.character!.upgrades.find(x => x.id === this.id);
                if (existingUpgrade) {
                    existingUpgrade = this.upgradeInformation;
                }
            },
            error: (err) => {
                // TODO: do something?
            }
        });
    }

    changeBonusFeature(value: MatSelectChange): void {
        if (!this.bonusFeatureInformation) {
            this.bonusFeatureInformation = new BonusFeatureUpgrade();
        }

        this.bonusFeatureInformation.bonusFeatureId = value.value;

        if (!this.upgradeInformation) {
            this.upgradeInformation = new Upgrade({ id: this.id, option: UpgradeOption.bonusFeature })
        }

        this.upgradeInformation!.choice = this.bonusFeatureInformation;

        const upgradeRequest = new UpsertUpgradeRequest({ upgradeId: this.id, upgradeOption: UpgradeOption.bonusFeature, block: this.upgradeRule!.block, value: JSON.stringify(this.bonusFeatureInformation) });

        this.characterApi.upsertUpgrade(this.character!.id, upgradeRequest).subscribe({
            next: (_: string) => {
                let existingUpgrade = this.character!.upgrades.find(x => x.id === this.id);
                if (existingUpgrade) {
                    existingUpgrade = this.upgradeInformation;
                }
            },
            error: (err) => {
                //debugger;
            }
        });
    }

    getAvailableBonusFeatures(): Endowment[] {
        const foundMagicalPower = this.characterApi.rules?.magicalPowers.find(x => x.id === this.magicalPowerChoice.value);
        if (!foundMagicalPower) {
            return [];
        }

        const relevantUpgrades = this.character?.upgrades.filter(x => x.option === UpgradeOption.bonusFeature && x.id !== this.id);

        const featuresToFilterIds: number[] = [];

        relevantUpgrades?.forEach(relevantUpgrade => {
            const choice = relevantUpgrade.choice as BonusFeatureUpgrade;
            if (!choice) {
                // failsafe?
                return;
            }

            if (choice.magicalPowerId === this.magicalPowerChoice.value) {
                if (choice.bonusFeatureId) {
                    featuresToFilterIds.push(choice.bonusFeatureId);
                }
            }

            if (choice.nestedMagicalPowerId === this.magicalPowerChoice.value) {
                if (choice.nestedBonusFeatureId) {
                    featuresToFilterIds.push(choice.nestedBonusFeatureId);
                }
            }
        });

        return foundMagicalPower.bonusFeatures.filter(x => !featuresToFilterIds.includes(x.id));
    }

    isFiltered(item: Endowment): boolean {
        const relevantUpgrades = this.character?.upgrades.filter(x => x.option === UpgradeOption.bonusFeature);
        if (relevantUpgrades) {
            relevantUpgrades.forEach((upgrade) => {
                const choice = upgrade.choice as BonusFeatureUpgrade;
                if (choice) {
                    if (choice.bonusFeatureId == item.id) {
                        return true;
                    }
                }
                return false;
            });
        }

        return false;
    }

    openInfoDialog(): void {
        const config = new MatDialogConfig();
        const selectedMagicalPower = this.characterApi.rules?.magicalPowers.find(x => x.id === this.magicalPowerChoice.value);

        if (selectedMagicalPower) {
            config.data = { data: [selectedMagicalPower] };
            this.dialog.open(InformationDisplayComponent, config);
        }
    }
}
