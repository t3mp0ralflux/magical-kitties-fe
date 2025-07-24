export class EndowmentUpdate {
    previousId!: number;
    newId!: number;
    isPrimary!: boolean;

    constructor(init?: Partial<EndowmentUpdate>) {
        Object.assign(this, init);
    }
}