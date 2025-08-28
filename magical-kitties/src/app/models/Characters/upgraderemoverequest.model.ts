import { UpgradeOption } from "./upgradeoption.model";

export class UpgradeRemoveRequest {
    upgradeId!: string;
    upgradeOption!: UpgradeOption;
    value?: string;

    constructor(init?: Partial<UpgradeRemoveRequest>) {
        Object.assign(this, init);
    }
}