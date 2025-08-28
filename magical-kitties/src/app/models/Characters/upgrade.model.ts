import { AttributeOption } from "./attributeoption.model";

export class Upgrade {
    id!: string;
    block!: number;
    option!: AttributeOption;
    choice?: object;

    constructor(init?: Partial<Upgrade>) {
        Object.assign(this, init);
    }
}