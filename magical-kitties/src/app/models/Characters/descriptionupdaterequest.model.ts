export class DescriptionUpdateRequest {
    characterId!: string;
    name?: string;
    description?: string;
    hometown?: string;

    constructor(init?: Partial<DescriptionUpdateRequest>) {
        Object.assign(this, init);
    }
}