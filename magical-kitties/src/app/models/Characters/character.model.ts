import { ImproveAttributeUpgrade } from "../../characters/characterbuilderkitty/attribute-increase/models/attribute-increase.model";
import { AttributeOption } from "./attributeoption.model";
import { Flaw } from "./flaw.model";
import { Human } from "./human.model";
import { MagicalPower } from "./magicalpower.model";
import { Talent } from "./talent.model";
import { Upgrade } from "./upgrade.model";
import { UpgradeOption } from "./upgradeoption.model";

export class Character {
    id!: string;
    accountId!: string;
    name!: string;
    description!: string;
    flaw?: Flaw;
    talents: Talent[] = [];
    magicalPowers: MagicalPower[] = [];
    hometown?: string = "";
    humans: Human[] = [];
    level!: number;
    currentXp!: number;
    private cunning!: number;
    private cute!: number;
    private fierce!: number;
    private maxOwies!: number;
    cunningDisplay: number = 0;
    cuteDisplay: number = 0;
    fierceDisplay: number = 0;
    maxOwiesDisplay!: number;
    currentOwies!: number;
    startingTreats!: number;
    currentTreats!: number;
    private _currentInjuries: number = 0;
    public set currentInjuries(value: number) {
        this._currentInjuries = value;

        this.updateCalculatedValues();
    }

    public get currentInjuries(): number {
        return this._currentInjuries;
    }
    incapacitated!: boolean;
    upgrades: Upgrade[] = [];

    constructor(init?: Partial<Character>) {
        Object.assign(this, init);

        this.updateCalculatedValues();
    }

    updateCalculatedValues(): void {
        // reset to baseline
        this.cunningDisplay = 0;
        this.cuteDisplay = 0;
        this.fierceDisplay = 0;
        this.maxOwiesDisplay = 0;

        // run upgrades to alter display values to user.
        this.upgrades.forEach((upgrade: Upgrade) => {
            switch (upgrade.option) {
                case UpgradeOption.attribute3:
                case UpgradeOption.attribute4:
                    const attributeUpgrade = upgrade.choice as ImproveAttributeUpgrade;
                    switch (attributeUpgrade.attributeOption) {
                        case AttributeOption.cute:
                            this.cuteDisplay += 1;
                            break;
                        case AttributeOption.cunning:
                            this.cunningDisplay += 1;
                            break;
                        case AttributeOption.fierce:
                            this.fierceDisplay += 1;
                            break;
                        default:
                            break;
                    }
                    break;
                case UpgradeOption.owieLimit:
                    this.maxOwiesDisplay += 1;
                    break;
                case UpgradeOption.treatsValue:
                    this.startingTreats += 1;
                    break;
                default:
                    break;
            }
        });

        this.cunningDisplay += this.cunning;
        this.cuteDisplay += this.cute;
        this.fierceDisplay += this.fierce;
        this.maxOwiesDisplay += this.maxOwies;

        this.cunningDisplay -= this.currentInjuries;
        this.cuteDisplay -= this.currentInjuries;
        this.fierceDisplay -= this.currentInjuries;

        // displays can't go below 0
        if (this.cunningDisplay < 0) {
            this.cunningDisplay = 0;
        }

        if (this.cuteDisplay < 0) {
            this.cuteDisplay = 0;
        }

        if (this.fierceDisplay < 0) {
            this.fierceDisplay = 0;
        }
    }

    setBaseCuteValue(value: number): void {
        this.cute = value;
    }

    getBaseCuteValue(): number {
        return this.cute;
    }

    setBaseCunningValue(value: number): void {
        this.cunning = value;
    }

    getBaseCunningValue(): number {
        return this.cunning;
    }

    setBaseFierceValue(value: number): void {
        this.fierce = value;
    }

    getBaseFierceValue(): number {
        return this.fierce;
    }
}