export class Endowment {
    id!: number;
    name!: string;
    description!: string;

    constructor(init?: Partial<Endowment>) {
        Object.assign(this, init);
    }
}