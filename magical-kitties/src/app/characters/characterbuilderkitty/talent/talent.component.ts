import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { AttributeOption } from '../../../models/Characters/attributeoption.model';
import { Character } from '../../../models/Characters/character.model';
import { Talent } from '../../../models/Characters/talent.model';
import { Upgrade } from '../../../models/Characters/upgrade.model';
import { UpgradeOption } from '../../../models/Characters/upgradeoption.model';
import { UpgradeRemoveRequest } from '../../../models/Characters/upgraderemoverequest.model';
import { UpsertUpgradeRequest } from '../../../models/Characters/upsertupgraderequest.model';
import { CharacterUpdate } from '../../../models/System/characterupdate.model';
import { UpgradeRule } from '../../../models/System/upgraderule.model';
import { CharacterAPIService } from '../../services/characters.service';
import { InformationDisplayComponent } from '../information-display/information-display.component';
import { TalentUpgrade } from './models/talent-upgrade.model';

@Component({
    selector: 'app-talent',
    imports: [CommonModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule, MatCheckboxModule, MatIconModule],
    templateUrl: './talent.component.html',
    styleUrl: './talent.component.scss'
})
export class TalentComponent implements AfterContentInit, OnDestroy {
    @Input() id?: string;
    @Input() parentControl!: any;
    @Input() disabled!: boolean;
    @Output() upgradeSelected = new EventEmitter<boolean>();
    showOptions: Boolean = false;
    characterApi: CharacterAPIService = inject(CharacterAPIService);
    dialog: MatDialog = inject(MatDialog);
    talentChoice: FormControl = new FormControl({ value: undefined, disabled: this.disabled });
    upgradeRule?: UpgradeRule;
    characterSubscription: Subscription;
    availableTalents: Talent[] = [];
    private character?: Character;
    private upgradeInformation?: Upgrade;
    private talentInformation?: TalentUpgrade;

    constructor() {
        this.characterSubscription = this.characterApi.character$.subscribe({
            next: (character) => {
                if (character) {
                    this.character = character;
                }
            }
        });
    }

    ngAfterContentInit(): void {
        this.upgradeInformation = this.character?.upgrades.find(x => x.id === this.id);

        this.upgradeRule = this.characterApi.rules?.upgrades.find(x => x.id === this.id);

        if (this.upgradeInformation?.choice) {
            this.talentInformation = this.upgradeInformation.choice as TalentUpgrade;
            this.talentChoice.setValue(this.talentInformation.talentId);
        }

        this.showOptions = this.parentControl.value === true;

        this.getAvailableTalents();

        this.characterApi.characterChanged$.subscribe({
            next: (update: CharacterUpdate) => {
                if (update.attributeOption === undefined) {
                    return;
                }

                switch (update.attributeOption.valueOf()) {
                    case AttributeOption.level:
                        if (update.value === true) {
                            this.talentChoice.setValue(undefined);

                            this.showOptions = false;
                        }
                        break;
                    case AttributeOption.talent:
                        this.talentChoice.setValue(undefined);
                        this.getAvailableTalents();
                        break;
                }
            }
        });
    }

    ngOnDestroy(): void {
        if (this.characterSubscription) {
            this.characterSubscription.unsubscribe();
        }
    }

    checkChange(event: MatCheckboxChange) {
        if (event.checked) {
            const newUpgrade = new Upgrade({ id: this.id, option: UpgradeOption.talent, block: this.upgradeRule!.block });
            const upgradeRequest = new UpsertUpgradeRequest({ upgradeId: this.id, upgradeOption: UpgradeOption.talent, block: this.upgradeRule!.block });
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

            const upgradeRemoveRequest = new UpgradeRemoveRequest({ upgradeId: this.id, upgradeOption: UpgradeOption.talent })
            this.characterApi.removeUpgrade(this.character!.id, upgradeRemoveRequest).subscribe({
                next: (_: string) => {
                    const upgradeIndex = this.character?.upgrades.findIndex(x => x.id === existingUpgrade.id);
                    if (upgradeIndex !== undefined && upgradeIndex >= 0) {
                        this.character!.upgrades.splice(upgradeIndex, 1);
                        this.talentChoice.setValue(undefined);
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

    changeTalent(value: MatSelectChange): void {
        if (!this.talentInformation) {
            this.talentInformation = new TalentUpgrade();
        }

        this.talentInformation.talentId = value.value;

        if (!this.upgradeInformation) {
            this.upgradeInformation = new Upgrade({ id: this.id, option: UpgradeOption.talent });
        }

        this.upgradeInformation!.choice = this.talentInformation;

        const upgradeRequest = new UpsertUpgradeRequest({ upgradeId: this.id, upgradeOption: UpgradeOption.talent, block: this.upgradeRule!.block, value: JSON.stringify(this.talentInformation) });

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

    getAvailableTalents(): void {
        const assignedTalent = this.character?.talents.find(x => x.isPrimary === true);
        this.availableTalents = assignedTalent ? this.characterApi.rules!.talents.filter(x => x.id !== assignedTalent.id) : this.characterApi.rules!.talents;
    }

    openInfoDialog(data: Talent[] | undefined, anchor: number): void {
        const config = new MatDialogConfig();
        config.data = { data: data, anchor: anchor };
        this.dialog.open(InformationDisplayComponent, config);
    }
}
