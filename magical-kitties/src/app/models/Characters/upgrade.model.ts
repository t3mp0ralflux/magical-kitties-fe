import { AttributeOption } from "./attributeoption.model";

export class Upgrade {
    id!: string;
    block!: number;
    level!: number;
    option!: AttributeOption;
    choice!: object;
}