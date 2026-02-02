
import { AfterContentInit, Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MarkdownComponent } from "ngx-markdown";
import { BehaviorSubject, combineLatest, Observable, pairwise, startWith, Subscription, tap } from 'rxjs';
import { getValue } from '../../login/utilities';
import { AttributeOption } from '../../models/Characters/attributeoption.model';
import { Character } from '../../models/Characters/character.model';
import { DescriptionOption } from '../../models/Characters/descriptionoption.model';
import { EndowmentUpdate } from '../../models/Characters/endowmentupdate.model';
import { Flaw } from '../../models/Characters/flaw.model';
import { MagicalPower } from '../../models/Characters/magicalpower.model';
import { Talent } from '../../models/Characters/talent.model';
import { UpdateCharacterAttributes } from '../../models/Characters/updateacharacterattributes.model';
import { UpgradeOption } from '../../models/Characters/upgradeoption.model';
import { CharacterUpdate } from '../../models/System/characterupdate.model';
import { UpgradeRule } from '../../models/System/upgraderule.model';
import { ConfirmModalComponent } from '../../sharedcomponents/confirm-modal/confirm-modal.component';
import { CopyObject, trackByFn } from '../../utilities';
import { CharacterAPIService } from '../services/characters.service';
import { AttributeIncreaseComponent } from "./attribute-increase/attribute-increase.component";
import { BonusFeatureComponent } from "./bonus-feature/bonus-feature.component";
import { IncreaseLimitComponent } from "./increase-limit/increase-limit.component";
import { InformationDisplayComponent } from './information-display/information-display.component';
import { MagicalPowerComponent } from "./magical-power/magical-power.component";
import { TalentComponent } from "./talent/talent.component";

@Component({
    selector: 'app-characterbuilderkitty',
    imports: [MatDividerModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatIconModule, MatCardModule, MatCheckboxModule, MarkdownComponent, MatExpansionModule, BonusFeatureComponent, AttributeIncreaseComponent, IncreaseLimitComponent, TalentComponent, MagicalPowerComponent],
    templateUrl: './characterbuilderkitty.component.html',
    styleUrl: './characterbuilderkitty.component.scss'
})
export class CharacterBuilderKittyComponent implements AfterContentInit, OnDestroy {
    private _snackBar: MatSnackBar = inject(MatSnackBar);
    characterApi: CharacterAPIService = inject(CharacterAPIService);
    dialog: MatDialog = inject(MatDialog);
    formBuilder: FormBuilder = inject(FormBuilder);
    character?: Character;
    levelOptions: number[] = Array(10).fill(1).map((_, i) => i + 1);
    getValue = getValue;
    trackByFn = trackByFn;
    UpgradeOption = UpgradeOption;
    AttributeOption = AttributeOption;
    levelControl: FormControl = new FormControl();
    statArray: number[] = [1, 2, 3]
    filteredStatArray: number[] = [];
    availableStats: number[] = [];
    xpControl: FormControl = new FormControl();
    cuteControl: FormControl = new FormControl();
    cunningControl: FormControl = new FormControl();
    fierceControl: FormControl = new FormControl();
    flawControl: FormControl = new FormControl();
    talentControl: FormControl = new FormControl();
    magicalPowerControl: FormControl = new FormControl();
    upgradeCheckedSubject: BehaviorSubject<{ checked: boolean, id: string }> = new BehaviorSubject<{ checked: boolean, id: string }>({ checked: false, id: "" });
    upgradeChecked$: Observable<{ checked: boolean, id: string }> = this.upgradeCheckedSubject.asObservable();

    selectedUpgrades: FormGroup = this.formBuilder.group({
        block1bonusFeature: new FormControl(""),
        block1attribute3: new FormControl(""),
        block1owieLimit: new FormControl(""),
        block1treatsValue: new FormControl(""),
        block2talent: new FormControl(""),
        block2bonusFeature: new FormControl(""),
        block2attribute4: new FormControl(""),
        block2owieLimit: new FormControl(""),
        block2treatsValue: new FormControl(""),
        block3magicalPower: new FormControl(""),
        block3bonusFeature: new FormControl(""),
        block3attribute4: new FormControl(""),
        block3owieLimit: new FormControl(""),
        block3treatsValue: new FormControl(""),
    });

    editorSubscriptions: Subscription[] = [];

    get block1Bonus() {
        return this.selectedUpgrades.controls['block1bonusFeature'];
    }

    get block1Attribute() {
        return this.selectedUpgrades.controls['block1attribute3'];
    }

    get block1owieLimit() {
        return this.selectedUpgrades.controls['block1owieLimit'];
    }

    get block1treatsValue() {
        return this.selectedUpgrades.controls['block1treatsValue'];
    }

    get block2talent() {
        return this.selectedUpgrades.controls["block2talent"];
    }

    get block2Bonus() {
        return this.selectedUpgrades.controls['block2bonusFeature'];
    }

    get block2Attribute() {
        return this.selectedUpgrades.controls['block2attribute4'];
    }

    get block2owieLimit() {
        return this.selectedUpgrades.controls['block2owieLimit'];
    }

    get block2treatsValue() {
        return this.selectedUpgrades.controls['block2treatsValue'];
    }

    get block3MagicalPower() {
        return this.selectedUpgrades.controls["block3magicalPower"];
    }

    get block3Bonus() {
        return this.selectedUpgrades.controls['block3bonusFeature'];
    }

    get block3Attribute() {
        return this.selectedUpgrades.controls['block3attribute4'];
    }

    get block3owieLimit() {
        return this.selectedUpgrades.controls['block3owieLimit'];
    }

    get block3treatsValue() {
        return this.selectedUpgrades.controls['block3treatsValue'];
    }

    constructor() {
        const characterSubscription = combineLatest({
            character: this.characterApi.character$,
            rules: this.characterApi.getRules()
        }).subscribe({
            next: ({ character, rules }) => {
                if (character === undefined) {
                    return;
                }

                rules.upgrades.forEach(element => {
                    this.selectedUpgrades.addControl(element.id, new FormControl());
                });

                this.levelControl.setValue(character?.level);
                this.xpControl.setValue(character?.currentXp);
                this.cuteControl.setValue(character?.getBaseCuteValue());
                this.cunningControl.setValue(character?.getBaseCunningValue());
                this.fierceControl.setValue(character?.getBaseFierceValue());

                if (character.flaw) {
                    this.flawControl.setValue(character.flaw.id);
                }

                if (character.talents.length > 0) {
                    const primaryTalent = character.talents.find(x => x.isPrimary === true);

                    if (primaryTalent) {
                        this.talentControl.setValue(primaryTalent.id);
                    }
                }

                if (character.magicalPowers.length > 0) {
                    const primaryMagicalPower = character.magicalPowers.find(x => x.isPrimary === true);

                    if (primaryMagicalPower) {
                        this.magicalPowerControl.setValue(primaryMagicalPower.id);
                    }
                }

                character.upgrades.forEach((upgrade) => {
                    const controlName = `block${upgrade.block}${UpgradeOption[upgrade.option!]}`;

                    this.selectedUpgrades.controls[controlName].setValue(true);
                });

                this.character = character;

                if (this.upgradesDisabled()) {
                    this.disableControls();
                } else {
                    this.enableControls();
                }
            }
        });

        this.editorSubscriptions.push(characterSubscription);
    }

    ngAfterContentInit(): void {
        const cunningControlSubscription = this.cunningControl.valueChanges.pipe(
            startWith(this.cunningControl.value),
            pairwise(),
            tap(([previous, next]) => {
                this.applyFilter(previous, next);
            })
        ).subscribe();

        const cuteControlSubscription = this.cuteControl.valueChanges.pipe(
            startWith(this.cuteControl.value),
            pairwise(),
            tap(([previous, next]) => {
                this.applyFilter(previous, next);
            })
        ).subscribe();

        const fierceControlSubscription = this.fierceControl.valueChanges.pipe(
            startWith(this.fierceControl.value),
            pairwise(),
            tap(([previous, next]) => {
                this.applyFilter(previous, next);
            })
        ).subscribe();

        this.editorSubscriptions.push(...[cunningControlSubscription, cuteControlSubscription, fierceControlSubscription]);
    }

    ngOnDestroy(): void {
        this.resetControls();

        this.editorSubscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    getUpgradeFromCharacter(id?: string) {
        if (!id) {
            return;
        }

        const characterUpgrade = this.character?.upgrades.find(x => x.id === id);

        return characterUpgrade;
    }

    getUpgradeIdFromRules(block: number, upgradeOption: UpgradeOption) {
        const foundUpgrade = this.characterApi.rules?.upgrades.find(x => x.block === block && x.upgradeOption === upgradeOption);

        return foundUpgrade?.id;
    }

    checkChange() {
        if (this.upgradesDisabled()) {
            this.disableControls();
        } else {
            this.enableControls();
        }
    }

    disableControls(): void {
        Object.keys(this.selectedUpgrades.controls).forEach((key: string) => {
            const control = this.selectedUpgrades.controls[key];
            if (control.value !== true) {
                control.disable();
            }
        });
    }

    enableControls(): void {
        Object.keys(this.selectedUpgrades.controls).forEach((key: string) => {
            const control = this.selectedUpgrades.controls[key];
            control.enable();
        });
    }

    resetControls(): void {
        this.cunningControl.reset();
        this.cuteControl.reset();
        this.fierceControl.reset();
        this.flawControl.reset();
        this.talentControl.reset();
        this.magicalPowerControl.reset();

        Object.keys(this.selectedUpgrades.controls).forEach((key: string) => {
            const control = this.selectedUpgrades.controls[key];
            control.reset();
        })
    }

    resetUpgrades(): void {
        Object.keys(this.selectedUpgrades.controls).forEach((key: string) => {
            const control = this.selectedUpgrades.controls[key];
            control?.setValue(false);
        });

        this.character!.upgrades = [];
    }

    upgradesDisabled(): boolean {
        const selectedValues = Object.values(this.selectedUpgrades.value);

        return selectedValues.filter(x => x === true).length >= this.character!.level - 1; // nothing at level 1, so minus one to ensure off-by-one error reduction
    }

    upgradeSelected(upgradeId: string): boolean {
        return this.selectedUpgrades.controls[upgradeId].value;
    }

    applyFilter(previous: number, next: number) {
        if (previous !== null && previous !== 0) {
            this.filteredStatArray.splice(this.filteredStatArray.indexOf(previous), 1);
        }

        if (next !== 0) {
            this.filteredStatArray.push(next);
        }

        this.filteredStatArray.sort();
    }

    isFiltered(value: number) {
        return this.filteredStatArray.includes(value);
    }

    getFlawDescription(id: number) {
        const flaw = this.characterApi.rules?.flaws.find(x => x.id === id);

        return flaw?.description ?? "";
    }

    getTalentDescription(id: number) {
        const talent = this.characterApi.rules?.talents.find(x => x.id === id);

        return talent?.description;
    }

    getMagicalPowerDescription(id: number) {
        const power = this.characterApi.rules?.magicalPowers.find(x => x.id === id);

        return power?.description;
    }

    getBlockRules(block: number): UpgradeRule[] {
        return this.characterApi.rules?.upgrades?.filter(x => x.block === block) ?? [];
    }

    updateAttribute(event: MatSelectChange, option: AttributeOption): void {
        const payload: UpdateCharacterAttributes = {
            characterId: this.character?.id!,
        }

        switch (option) {
            case AttributeOption.cunning:
                payload.cunning = event.value;
                break;
            case AttributeOption.cute:
                payload.cute = event.value;
                break;
            case AttributeOption.fierce:
                payload.fierce = event.value;
                break;
            default:
                break;
        }

        this.characterApi.updateAttribute(option, payload).subscribe({
            next: (_) => {
                switch (option) {
                    case AttributeOption.cunning:
                        this.character!.setBaseCunningValue(event.value);
                        break;
                    case AttributeOption.cute:
                        this.character!.setBaseCuteValue(event.value);
                        break;
                    case AttributeOption.fierce:
                        this.character!.setBaseFierceValue(event.value);
                        break;
                    default:
                        break;
                }

                this.characterApi.characterHasChanged(new CharacterUpdate({ attributeOption: option, value: event.value }));
            }
        });
    }

    updateXP(xp: string): void {
        let numberOfXp: number;

        try {
            numberOfXp = Number.parseInt(xp);
        } catch {
            // show error
            return;
        }

        const payload: UpdateCharacterAttributes = {
            characterId: this.character?.id!,
            xp: numberOfXp
        }

        this.characterApi.updateAttribute(AttributeOption.xp, payload).subscribe({
            next: () => {
                this.characterApi.characterHasChanged(new CharacterUpdate({ descriptionOption: DescriptionOption.xp }));
            },
            error: (errors: any) => {
                const config = new MatSnackBarConfig();

                config.horizontalPosition = "end";
                config.verticalPosition = "top";
                config.panelClass = "snackbar-error";

                if (!errors.length) {
                    this._snackBar.open("Internal Server Error. Contact Support or try again.", "OK");
                } else {
                    this._snackBar.open(errors[0].message, "Sorry", config);
                }
            }
        })
    }

    updateLevel(event: MatSelectChange): void {
        const payload: UpdateCharacterAttributes = {
            characterId: this.character?.id!,
            level: this.levelControl.value,
            xp: 0
        };

        if (event.value < this.character!.level) {
            const dialogData = { message: "You are about to lower your level. Any accrued XP for this level along with any relevant upgrade choices will be removed. Are you sure you want to do this?" };

            const dialogSubscription = this.dialog.open(ConfirmModalComponent, { data: dialogData }).afterClosed().subscribe({
                next: (result) => {
                    if (result) {
                        this.submitLevelChange(payload);
                        this.character!.currentXp = 0;
                        this.resetUpgrades();
                    }
                },
                error: (err) => {
                    //debugger;
                }
            });

            this.editorSubscriptions.push(dialogSubscription);
        } else {
            this.submitLevelChange(payload);
        }
    }

    updateFlaw(event: MatSelectChange): void {
        const updatedFlawId: number = event.value;
        const updatedFlaw: Flaw = this.characterApi.rules?.flaws.find(x => x.id === updatedFlawId)!;

        const flawUpdate = new EndowmentUpdate({
            previousId: this.character?.flaw?.id ?? updatedFlaw.id,
            newId: updatedFlaw.id,
            isPrimary: false
        });

        const payload: UpdateCharacterAttributes = {
            characterId: this.character?.id!,
            flawChange: flawUpdate
        }

        this.characterApi.updateAttribute(AttributeOption.flaw, payload).subscribe({
            next: (_) => {
                this.character!.flaw = updatedFlaw;
            }
        });
    }

    updateTalent(event: MatSelectChange): void {
        const updatedTalentId: number = event.value;
        const updatedTalent: Talent = CopyObject(this.characterApi.rules?.talents.find(x => x.id === updatedTalentId)!);
        updatedTalent.isPrimary = true;

        const talentUpdate = new EndowmentUpdate({
            previousId: this.character?.talents[0]?.id ?? updatedTalent.id,
            newId: updatedTalent.id,
            isPrimary: true
        });

        const payload: UpdateCharacterAttributes = {
            characterId: this.character?.id!,
            talentChange: talentUpdate
        }

        this.characterApi.updateAttribute(AttributeOption.talent, payload).subscribe({
            next: (_) => {
                this.character!.talents[0] = updatedTalent;

                this.characterApi.characterHasChanged(new CharacterUpdate({ attributeOption: AttributeOption.talent, value: event.value }));
            }
        });
    }

    updateMagicalPower(event: MatSelectChange): void {
        const updatedMagicalPowerId: number = event.value;
        const updatedMagicalPower: MagicalPower = this.characterApi.rules?.magicalPowers.find(x => x.id === updatedMagicalPowerId)!;

        const magicalPowerUpdate = new EndowmentUpdate({
            previousId: this.character?.magicalPowers[0]?.id ?? updatedMagicalPower.id,
            newId: updatedMagicalPower.id,
            isPrimary: true
        });

        const payload: UpdateCharacterAttributes = {
            characterId: this.character?.id!,
            magicalPowerChange: magicalPowerUpdate
        }

        this.characterApi.updateAttribute(AttributeOption.magicalpower, payload).subscribe({
            next: () => {
                this.character!.magicalPowers[0] = updatedMagicalPower;
                this.characterApi.characterHasChanged(new CharacterUpdate({ attributeOption: AttributeOption.magicalpower }));
            }
        });
    }

    openInfoDialog(data: Flaw[] | Talent[] | MagicalPower[] | undefined, anchor: number): void {
        const config = new MatDialogConfig();
        config.data = { data: data, anchor: anchor };
        this.dialog.open(InformationDisplayComponent, config);
    }

    private submitLevelChange(payload: UpdateCharacterAttributes) {
        this.characterApi.updateLevel(payload).subscribe({
            next: (_) => {
                let shouldResetElements = false;

                // only do this on going down a level. At this point, the character isn't updated and is still the old value.
                if (this.character!.level > this.levelControl.value) {
                    shouldResetElements = true;
                }

                this.character!.level = this.levelControl.value;

                this.checkChange();
                this.characterApi.characterHasChanged(new CharacterUpdate({ attributeOption: AttributeOption.level, value: shouldResetElements })); // send a reset signal.
            }
        });
    }
}
