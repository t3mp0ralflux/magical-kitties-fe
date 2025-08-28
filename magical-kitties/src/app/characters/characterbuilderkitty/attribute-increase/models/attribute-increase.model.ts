import { AttributeOption } from "../../../../models/Characters/attributeoption.model";

export class ImproveAttributeUpgrade {
    attributeOption!: AttributeOption;

    constructor(init?: Partial<ImproveAttributeUpgrade>) {
        Object.assign(this, init);
    }
}