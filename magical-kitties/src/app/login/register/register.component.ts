import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../models/Account/account.model';
import { AccountCreateRequest } from '../../models/Account/accountcreaterequest.model';
import { ValidationError } from '../../models/Errors/Error.model';
import { ValidationErrorResponse } from '../../models/Errors/ValidationErrorResponse.model';
import { AuthService } from '../../services/authService.service';

@Component({
    selector: 'app-register',
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    private _snackBar = inject(MatSnackBar);
    formGroup: FormGroup;
    hidePassword: boolean = true;
    formSubmitting: boolean = false;
    registrationComplete: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
        this.formGroup = fb.group(
            {
                firstName: new FormControl("", [Validators.required]),
                lastName: new FormControl("", [Validators.required]),
                email: new FormControl("", [Validators.required, Validators.email]),
                username: new FormControl("", [Validators.required]),
                password: new FormControl("", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z].)(?=.*[@$!%*#?&^_-]).{8,}/)]),
                passwordReEnter: new FormControl("", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z].)(?=.*[@$!%*#?&^_-]).{8,}/)])
            },
            {
                validators: this.matchValidator('password', 'passwordReEnter')
            })
    }

    openSnackBar(message: string, action: string) {
        let snackBar: MatSnackBarRef<TextOnlySnackBar> = this._snackBar.open(message, action, {});
        snackBar.onAction().subscribe({
            next: (thing: any) => {
                this.submit();
            }
        });
    }

    submit(): void {
        this.formSubmitting = true;
        const registerInfo = new AccountCreateRequest({
            firstName: this.formGroup.controls['firstName'].value,
            lastName: this.formGroup.controls['lastName'].value,
            username: this.formGroup.controls['username'].value,
            email: this.formGroup.controls['email'].value,
            password: this.formGroup.controls['password'].value
        });

        this.authService.register(registerInfo).subscribe({
            next: (response: Account) => {
                this.registrationComplete = true;
            },
            error: (error: HttpErrorResponse) => {
                switch (error.status) {
                    case 400:
                        const errorList = error.error as ValidationErrorResponse;

                        errorList.errors.forEach((error: ValidationError) => {
                            this.formGroup.controls[error.propertyName.toLowerCase()].setErrors({ api: error.message });
                        });
                        break;

                    case 500:
                        this.openSnackBar("Internal Server Error", "Retry");
                        break;
                    default:
                        this.openSnackBar("Something went wrong.", "Retry");
                        break;
                }

                this.formSubmitting = false;
            },
            complete: (() => this.formSubmitting = false)
        });
    }

    matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
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
    }
}
