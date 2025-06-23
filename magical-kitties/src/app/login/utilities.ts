import { AbstractControl, ValidatorFn } from "@angular/forms";

export function MatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
        const control = abstractControl.get(controlName);
        const matchingControl = abstractControl.get(matchingControlName);

        if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
            return null;
        }

        if (control!.value !== matchingControl!.value) {
            const error = { confirmedValidator: true };
            matchingControl!.setErrors(error);
            control!.setErrors(error);
            return error;
        } else {
            matchingControl!.setErrors(null);
            control!.setErrors(null);
            return null;
        }
    }
};