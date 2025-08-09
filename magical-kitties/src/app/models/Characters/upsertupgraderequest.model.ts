import { AttributeOption } from "./attributeoption.model";
import { UpgradeOption } from "./upgradeoption.model";

export class UpsertUpgradeRequest {
    upgradeId!: string;
    upgradeOption!: UpgradeOption;
    attributeOption!: AttributeOption;
    block!: number;
    value?: string;

    constructor(init?: Partial<UpsertUpgradeRequest>) {
        Object.assign(this, init);
    }
}