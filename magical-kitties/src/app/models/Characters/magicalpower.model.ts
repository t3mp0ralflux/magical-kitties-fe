import { Endowment } from "./endowment.model";

export class MagicalPower extends Endowment {
    isPrimary!: boolean;
    bonusFeatures: MagicalPower[] = [];
}