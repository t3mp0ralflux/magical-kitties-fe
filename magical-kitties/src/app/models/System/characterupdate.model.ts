import { AttributeOption } from "../Characters/attributeoption.model";
import { DescriptionOption } from "../Characters/descriptionoption.model";
import { UpgradeOption } from "../Characters/upgradeoption.model";

export class CharacterUpdate {
    attributeOption?: AttributeOption;
    upgradeOption?: UpgradeOption;
    descriptionOption?: DescriptionOption;
    value: any;

    constructor(init?: Partial<CharacterUpdate>) {
        Object.assign(this, init);
    }
}