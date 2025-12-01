import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Account } from '../../models/Account/account.model';
import { AccountCreateRequest } from '../../models/Account/accountcreaterequest.model';
import { ValidationError } from '../../models/Errors/Error.model';
import { ValidationErrorResponse } from '../../models/Errors/ValidationErrorResponse.model';
import { LoginAPIService } from '../services/login.service';
import { MatchValidator } from '../utilities';

@Component({
    selector: 'app-register',
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy {
    private _snackBar = inject(MatSnackBar);
    private fb: FormBuilder = inject(FormBuilder);
    private loginService: LoginAPIService = inject(LoginAPIService);
    snackbarSubscription?: Subscription;
    formGroup: FormGroup;
    hidePassword: boolean = true;
    formSubmitting: boolean = false;
    registrationComplete: boolean = false;


    constructor() {
        this.formGroup = this.fb.group(
            {
                firstName: new FormControl("", [Validators.required]),
                lastName: new FormControl("", [Validators.required]),
                email: new FormControl("", [Validators.required, Validators.email]),
                username: new FormControl("", [Validators.required]),
                password: new FormControl("", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z].)(?=.*[@$!%*#?&^_-]).{8,}/)]),
                passwordReEnter: new FormControl("", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z].)(?=.*[@$!%*#?&^_-]).{8,}/)])
            },
            {
                validators: MatchValidator('password', 'passwordReEnter')
            })
    }

    ngOnDestroy(): void {
        if (this.snackbarSubscription) {
            this.snackbarSubscription.unsubscribe();
        }
    }

    openSnackBar(message: string, action: string) {
        let snackBar: MatSnackBarRef<TextOnlySnackBar> = this._snackBar.open(message, action, {});

        this.snackbarSubscription = snackBar.onAction().subscribe({
            next: (_: any) => {
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

        this.loginService.register(registerInfo).subscribe({
            next: (_: Account) => {
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
}
