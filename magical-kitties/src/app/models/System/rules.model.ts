import { Flaw } from "../Characters/flaw.model";
import { MagicalPower } from "../Characters/magicalpower.model";
import { Talent } from "../Characters/talent.model";
import { DiceDifficulty } from "./dicedifficulty.model";
import { DiceSuccess } from "./dicesuccess.model";
import { ProblemSource } from "./problemsource.model";
import { UpgradeRule } from "./upgraderule.model";

export interface Rules {
    maxLevel: number;
    minAttributeValue: number;
    maxAttributeValue: number;
    minInjuries: number;
    maxInjuries: number;
    levelExperiencePoints: number[];
    attributes: string[];
    flaws: Flaw[];
    talents: Talent[];
    magicalPowers: MagicalPower[];
    upgrades: UpgradeRule[];
    problemSource: ProblemSource[];
    emotion: ProblemSource[];
    diceRules: string[];
    diceDifficulties: DiceDifficulty[];
    diceSuccesses: DiceSuccess[];
    rollComplications: string[];
    rollBonus: string[];
    rollSuperBonus: string[];
    spendingKittyTreats: string[];
    healing: string[];
    endOfEpisodeInfo: string;
    endEpisodeQuestions: string[];
}