import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AttributeOption } from '../../../models/Characters/attributeoption.model';
import { Character } from '../../../models/Characters/character.model';
import { MagicalPower } from '../../../models/Characters/magicalpower.model';
import { Upgrade } from '../../../models/Characters/upgrade.model';
import { UpgradeOption } from '../../../models/Characters/upgradeoption.model';
import { UpgradeRemoveRequest } from '../../../models/Characters/upgraderemoverequest.model';
import { UpsertUpgradeRequest } from '../../../models/Characters/upsertupgraderequest.model';
import { CharacterUpdate } from '../../../models/System/characterupdate.model';
import { UpgradeRule } from '../../../models/System/upgraderule.model';
import { CharacterAPIService } from '../../services/characters.service';
import { InformationDisplayComponent } from '../information-display/information-display.component';
import { MagicalPowerUpgrade } from './models/magicalpower-upgrade.model';

@Component({
    selector: 'app-magical-power',
    imports: [CommonModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule, MatCheckboxModule, MatIconModule],
    templateUrl: './magical-power.component.html',
    styleUrl: './magical-power.component.scss'
})
export class MagicalPowerComponent implements AfterContentInit {
    @Input() id?: string;
    @Input() parentControl!: any;
    @Input() disabled!: boolean;
    @Output() upgradeSelected = new EventEmitter<boolean>();
    showOptions: Boolean = false;
    characterApi: CharacterAPIService = inject(CharacterAPIService);
    dialog: MatDialog = inject(MatDialog);
    private _snackBar: MatSnackBar = inject(MatSnackBar);
    magicalPowerChoice: FormControl = new FormControl({ value: undefined, disabled: this.disabled });
    upgradeRule?: UpgradeRule;
    availableMagicalPowers: MagicalPower[] = [];
    private character?: Character;
    private upgradeInformation?: Upgrade;
    private magicalPowerInformation?: MagicalPowerUpgrade;

    constructor() {
        this.characterApi.character$.subscribe({
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
            this.magicalPowerInformation = this.upgradeInformation.choice as MagicalPowerUpgrade;
            this.magicalPowerChoice.setValue(this.magicalPowerInformation.magicalPowerId);
        }

        this.showOptions = this.parentControl.value === true;

        this.getAvailableMagicalPowers();

        this.characterApi.characterChanged$.subscribe({
            next: (update: CharacterUpdate) => {
                if (update.attributeOption === undefined) {
                    return;
                }

                switch (update.attributeOption.valueOf()) {
                    case AttributeOption.level:
                        if (update.value === true) {
                            this.magicalPowerChoice.setValue(undefined);

                            this.showOptions = false;
                        }
                        break;
                    case AttributeOption.talent:
                        this.magicalPowerChoice.setValue(undefined);
                        this.getAvailableMagicalPowers();
                        break;
                }
            }
        })
    }

    checkChange(event: MatCheckboxChange) {
        if (event.checked) {
            const newUpgrade = new Upgrade({ id: this.id, option: UpgradeOption.magicalPower, block: this.upgradeRule!.block });
            const upgradeRequest = new UpsertUpgradeRequest({ upgradeId: this.id, upgradeOption: UpgradeOption.magicalPower, block: this.upgradeRule!.block });
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

            const upgradeRemoveRequest = new UpgradeRemoveRequest({ upgradeId: this.id, upgradeOption: UpgradeOption.magicalPower })
            this.characterApi.removeUpgrade(this.character!.id, upgradeRemoveRequest).subscribe({
                next: (_: string) => {
                    const upgradeIndex = this.character?.upgrades.findIndex(x => x.id === existingUpgrade.id);
                    if (upgradeIndex !== undefined && upgradeIndex >= 0) {
                        this.character!.upgrades.splice(upgradeIndex, 1);
                        this.magicalPowerChoice.setValue(undefined);
                    }
                    this.showOptions = false;
                },
                error: (err) => {
                    const config = new MatSnackBarConfig();

                    config.horizontalPosition = "end";
                    config.duration = 5000;
                    config.verticalPosition = "top";
                    config.panelClass = "snackbar-error";
                    this._snackBar.open(err[0].message, "Close", config);
                    this.parentControl.setValue(true);
                }
            });
        }

        this.upgradeSelected.next(event.checked);
    }

    changeMagicalPower(value: MatSelectChange): void {
        if (!this.magicalPowerInformation) {
            this.magicalPowerInformation = new MagicalPowerUpgrade();
        }
        const oldMagicalPowerId = this.magicalPowerInformation.magicalPowerId;

        // remove the old magical power from the mix before we continue.
        if (oldMagicalPowerId > 0) {
            this.character!.magicalPowers.splice(this.character!.magicalPowers.findIndex(x => x.id === oldMagicalPowerId), 1);
        }

        this.magicalPowerInformation.magicalPowerId = value.value;

        if (!this.upgradeInformation) {
            this.upgradeInformation = new Upgrade({ id: this.id, option: UpgradeOption.magicalPower });
        }

        this.upgradeInformation!.choice = this.magicalPowerInformation;

        const upgradeRequest = new UpsertUpgradeRequest({ upgradeId: this.id, upgradeOption: UpgradeOption.magicalPower, block: this.upgradeRule!.block, value: JSON.stringify(this.magicalPowerInformation) });

        this.characterApi.upsertUpgrade(this.character!.id, upgradeRequest).subscribe({
            next: (_: string) => {
                let existingUpgrade = this.character!.upgrades.find(x => x.id === this.id);
                if (existingUpgrade) {
                    existingUpgrade = this.upgradeInformation;
                }

                const foundMagicalPower = this.characterApi.rules?.magicalPowers.find(x => x.id === value.value);
                if (foundMagicalPower) {
                    this.character?.magicalPowers.push(foundMagicalPower);
                }

                this.characterApi.characterHasChanged(new CharacterUpdate({ attributeOption: AttributeOption.magicalpower, value: oldMagicalPowerId }));
            },
            error: (err) => {
                // re-add in case of an error.
                const foundMagicalPower = this.characterApi.rules?.magicalPowers.find(x => x.id === oldMagicalPowerId);
                if (foundMagicalPower) {
                    this.character?.magicalPowers.push(foundMagicalPower);
                }
            }
        });
    }

    getAvailableMagicalPowers(): void {
        const assignedMagicalPower = this.character?.magicalPowers.find(x => x.isPrimary === true);
        this.availableMagicalPowers = assignedMagicalPower ? this.characterApi.rules!.magicalPowers.filter(x => x.id !== assignedMagicalPower.id) : this.characterApi.rules!.magicalPowers;
    }

    openInfoDialog(data: MagicalPower[] | undefined, anchor: number): void {
        const config = new MatDialogConfig();
        config.data = { data: data, anchor: anchor };
        this.dialog.open(InformationDisplayComponent, config);
    }
}
