import { ValidationError } from "./Error.model";

export class ValidationErrorResponse {
    errors!: ValidationError[]

    constructor(init?: Partial<ValidationErrorResponse>) {
        Object.assign(this, init);
    }
}