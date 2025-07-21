export class EndowmentUpdate {
    previousId!: number;
    newId!: number;

    constructor(init?: Partial<EndowmentUpdate>) {
        Object.assign(this, init);
    }
}