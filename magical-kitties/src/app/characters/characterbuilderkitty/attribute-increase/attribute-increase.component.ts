import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AttributeOption } from '../../../models/Characters/attributeoption.model';
import { Character } from '../../../models/Characters/character.model';
import { Upgrade } from '../../../models/Characters/upgrade.model';
import { UpgradeOption } from '../../../models/Characters/upgradeoption.model';
import { UpgradeRemoveRequest } from '../../../models/Characters/upgraderemoverequest.model';
import { UpsertUpgradeRequest } from '../../../models/Characters/upsertupgraderequest.model';
import { CharacterUpdate } from '../../../models/System/characterupdate.model';
import { UpgradeRule } from '../../../models/System/upgraderule.model';
import { CharacterAPIService } from '../../services/characters.service';
import { ImproveAttributeUpgrade } from './models/attribute-increase.model';

@Component({
    selector: 'app-attribute-increase',
    imports: [CommonModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule, MatCheckboxModule],
    templateUrl: './attribute-increase.component.html',
    styleUrl: './attribute-increase.component.scss'
})
export class AttributeIncreaseComponent implements AfterContentInit {
    @Input() id?: string;
    @Input() parentControl!: any;
    @Input() disabled!: boolean;
    @Output() upgradeSelected = new EventEmitter<boolean>();
    showOptions: Boolean = false;
    characterApi: CharacterAPIService = inject(CharacterAPIService);
    attributeChoice: FormControl = new FormControl({ value: undefined, disabled: this.disabled });
    Attributes: AttributeOption[] = [];
    AttributeOption = AttributeOption;
    upgradeRule?: UpgradeRule;
    private character?: Character;
    private upgradeInformation?: Upgrade;
    private attributeInformation?: ImproveAttributeUpgrade;

    constructor() {
        this.characterApi.character$.subscribe({
            next: (character) => {
                this.character = character;
            }
        });

        this.characterApi.characterChanged$.subscribe({
            next: (update: CharacterUpdate) => {
                if (update.attributeOption === undefined) {
                    return;
                }

                switch (update.attributeOption.valueOf()) {
                    case AttributeOption.cunning:
                    case AttributeOption.cute:
                    case AttributeOption.fierce:
                        this.addValidAttributes();
                        break;
                    case AttributeOption.level:
                        if (update.value === true) {
                            this.attributeChoice.setValue(undefined);
                            this.showOptions = false;
                        }
                        break;
                    default:
                        break;
                }
            }
        })
    }

    ngAfterContentInit(): void {
        this.upgradeInformation = this.character?.upgrades.find(x => x.id === this.id);

        this.upgradeRule = this.characterApi.rules?.upgrades.find(x => x.id === this.id);

        if (this.upgradeInformation?.choice) {
            this.attributeInformation = this.upgradeInformation.choice as ImproveAttributeUpgrade;
            this.attributeChoice.setValue(this.attributeInformation.attributeOption);
        }

        this.addValidAttributes();

        this.showOptions = this.parentControl.value === true;
    }

    checkChange(event: MatCheckboxChange) {
        if (event.checked) {
            const newUpgrade = new Upgrade({ id: this.id, option: this.upgradeRule?.upgradeOption, block: this.upgradeRule!.block });
            const upgradeRequest = new UpsertUpgradeRequest({ upgradeId: this.id, upgradeOption: this.upgradeRule!.upgradeOption, block: this.upgradeRule!.block });
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

            const upgradeRemoveRequest = new UpgradeRemoveRequest({ upgradeId: this.id, upgradeOption: this.upgradeRule!.upgradeOption });
            this.characterApi.removeUpgrade(this.character!.id, upgradeRemoveRequest).subscribe({
                next: (_: string) => {
                    const upgradeIndex = this.character?.upgrades.findIndex(x => x.id === existingUpgrade.id);
                    if (upgradeIndex !== undefined && upgradeIndex >= 0) {
                        this.character!.upgrades.splice(upgradeIndex, 1);
                        this.attributeChoice.setValue(undefined);
                    }
                    this.showOptions = false;
                },
                error: (err) => {
                    // TODO: do something?
                }
            })
        }

        this.upgradeSelected.next(event.checked);
    }

    changeAttribute(value: MatSelectChange) {
        if (!this.attributeInformation) {
            this.attributeInformation = new ImproveAttributeUpgrade();
        }

        this.attributeInformation.attributeOption = value.value;

        if (!this.upgradeInformation) {
            this.upgradeInformation = new Upgrade({ id: this.id, option: this.upgradeRule!.upgradeOption });
        }

        this.upgradeInformation.choice = this.attributeInformation;

        const upgradeRequest = new UpsertUpgradeRequest({ upgradeId: this.id, upgradeOption: this.upgradeRule!.upgradeOption, block: this.upgradeRule!.block, value: JSON.stringify(this.attributeInformation) });

        this.characterApi.upsertUpgrade(this.character!.id, upgradeRequest).subscribe({
            next: (_: string) => {
                let existingUpgrade = this.character!.upgrades.find(x => x.id === this.id);
                if (existingUpgrade) {
                    existingUpgrade = this.upgradeInformation;
                }
            },
            error: (err) => {
                console.log(err[0].message);
            }
        });
    }

    addValidAttributes(): void {
        this.Attributes = [];
        let maxValue: number = 3;

        if (this.upgradeRule!.upgradeOption === UpgradeOption.attribute4) {
            maxValue = 4;
        }

        if (this.character!.cunning < maxValue) {
            this.Attributes.push(AttributeOption.cunning);
        }

        if (this.character!.cute < maxValue) {
            this.Attributes.push(AttributeOption.cute);
        }

        if (this.character!.fierce < maxValue) {
            this.Attributes.push(AttributeOption.fierce);
        }
    }
}
