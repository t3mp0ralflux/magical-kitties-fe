import { ValidationError } from "./Error.model";

export class ValidationErrorResponse {
    errors!: ValidationError[]
}