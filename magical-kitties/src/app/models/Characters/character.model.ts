import { Flaw } from "./flaw.model";
import { Human } from "./human.model";
import { MagicalPower } from "./magicalpower.model";
import { Talent } from "./talent.model";
import { Upgrade } from "./upgrade.model";

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
    cunning!: number;
    cute!: number;
    fierce!: number;
    maxOwies!: number;
    currentOwies!: number;
    startingTreats!: number;
    currentTreats!: number;
    currentInjuries!: number;
    upgrades: Upgrade[] = [];
    testValue: number = 0;
}