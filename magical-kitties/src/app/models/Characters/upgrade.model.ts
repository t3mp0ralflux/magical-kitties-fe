import { UpgradeOption } from "./upgradeoption.model";

export class Upgrade {
    id!: string;
    block!: number;
    option!: UpgradeOption;
    choice?: object;

    constructor(init?: Partial<Upgrade>) {
        Object.assign(this, init);
    }
}