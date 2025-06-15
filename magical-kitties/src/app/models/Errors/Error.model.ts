export class ValidationError {
    propertyName!: string;
    message!: string;

    constructor(init?: Partial<ValidationError>) {
        Object.assign(this, init);
    }
}