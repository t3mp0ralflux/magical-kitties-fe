import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AttributeOption } from '../../../models/Characters/attributeoption.model';
import { MagicalPower } from '../../../models/Characters/magicalpower.model';
import { Upgrade } from '../../../models/Characters/upgrade.model';
import { UpgradeRule } from '../../../models/System/upgraderule.model';
import { CharacterAPIService } from '../../services/characters.service';
import { BonusFeatureUpgrade } from './models/bonus-feature.model';

@Component({
    selector: 'app-bonus-feature',
    imports: [CommonModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule],
    templateUrl: './bonus-feature.component.html',
    styleUrl: './bonus-feature.component.scss'
})
export class BonusFeatureComponent implements AfterContentInit {
    @Input() id?: string;
    @Input() upgrade?: Upgrade;
    @Input() disabled!: boolean;
    @Input() characterCurrentPowers: MagicalPower[] = [];
    @Output() upgradeChanged = new EventEmitter();
    characterApi: CharacterAPIService = inject(CharacterAPIService);
    systemUpgrade?: UpgradeRule;
    bonusFeatureInformation?: BonusFeatureUpgrade;
    magicalPowerChoice: FormControl = new FormControl({ value: this.upgrade?.id, disabled: this.disabled })

    constructor() {

    }

    ngAfterContentInit(): void {
        this.systemUpgrade = this.characterApi.rules?.upgrades.find(x => x.id === this.id);

        if (this.upgrade?.choice) {
            this.bonusFeatureInformation = JSON.parse(this.upgrade.choice);
            this.magicalPowerChoice.setValue(this.bonusFeatureInformation?.magicalPowerId);
        }
    }

    changeMagicalPower(value: MatSelectChange) {
        if (!this.bonusFeatureInformation) {
            this.bonusFeatureInformation = new BonusFeatureUpgrade();
        }

        this.bonusFeatureInformation.magicalPowerId = value.value;
        this.bonusFeatureInformation.bonusFeatureId = undefined; // reset this cause it's wrong.

        const payload = JSON.stringify(this.bonusFeatureInformation);

        if (!this.upgrade) {
            this.upgrade = new Upgrade({ id: this.id, option: AttributeOption.magicalpowerbonus })
        }

        this.upgrade!.choice = payload;

        this.upgradeChanged.emit(this.upgrade);
    }
}
