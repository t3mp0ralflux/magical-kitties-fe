export class Endowment {
    id!: string;
    name!: string;
    description!: string;

    constructor(init?: Partial<Endowment>) {
        Object.assign(this, init);
    }
}