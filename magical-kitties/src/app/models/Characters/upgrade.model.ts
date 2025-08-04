import { AttributeOption } from "./attributeoption.model";

export class Upgrade {
    id!: string;
    block!: number;
    option?: AttributeOption;
    choice?: string;

    constructor(init?: Partial<Upgrade>) {
        Object.assign(this, init);
    }
}