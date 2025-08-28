import { UpgradeOption } from "./upgradeoption.model";

export class UpsertUpgradeRequest {
    upgradeId!: string;
    upgradeOption!: UpgradeOption;
    block!: number;
    value?: string;

    constructor(init?: Partial<UpsertUpgradeRequest>) {
        Object.assign(this, init);
    }
}