import { UpgradeOption } from "../Characters/upgradeoption.model";

export interface UpgradeRule {
    id: string;
    block: number;
    value: string;
    upgradeOption: UpgradeOption;
}