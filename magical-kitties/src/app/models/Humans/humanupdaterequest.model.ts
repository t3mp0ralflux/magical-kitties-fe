import { DescriptionOption } from "../Characters/descriptionoption.model";

export class HumanUpdateRequest {
    option!: DescriptionOption;
    characterId!: string;
    humanId!: string;
    name?: string;
    description?: string;

    constructor(init?: Partial<HumanUpdateRequest>) {
        Object.assign(this, init);
    }
}