
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { Account } from '../../models/Account/account.model';
import { LoginModel } from '../../models/Login/login.model';
import { AuthService } from '../../services/authService.service';
import { ErrorSnackbarComponent } from '../../sharedcomponents/error-snackbar/error-snackbar.component';

@Component({
    selector: 'app-login',
    imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatInputModule, RouterLink, RouterLinkActive, MatProgressSpinnerModule, MatIconModule, MatDividerModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
    private _snackBar = inject(MatSnackBar);
    private fb: FormBuilder = inject(FormBuilder);
    private authService: AuthService = inject(AuthService);
    private router: Router = inject(Router);
    snackbarSubscription?: Subscription;
    formGroup: FormGroup;
    formSubmitting: boolean = false;
    loginError: boolean = false;
    accountError: boolean = false;
    accountErrorMessage: string = "";
    hidePassword: boolean = true;
    returnUrl: string = "";
    resumeNavigation: boolean = false;

    constructor() {
        this.formGroup = this.fb.group({
            email: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required])
        })

        const returnUrlState = this.router.lastSuccessfulNavigation()?.extras.state;
        if (returnUrlState) {
            this.returnUrl = returnUrlState!['resumeUrl'];
            this.resumeNavigation = returnUrlState!['resumeNavigation'];
        }
    }

    ngOnDestroy(): void {
        if (this.snackbarSubscription) {
            this.snackbarSubscription.unsubscribe();
        }
    }

    openSnackBar(message: string, action: string) {
        const snackBar: MatSnackBarRef<ErrorSnackbarComponent> = this._snackBar.openFromComponent(ErrorSnackbarComponent, { data: message });

        this.snackbarSubscription = snackBar.onAction().subscribe({
            next: (_: any) => {
                this.login();
            }
        });
    }

    login(): void {
        this.formSubmitting = true;
        this.loginError = false;
        this.accountError = false;
        this.accountErrorMessage = "";

        const loginInfo = new LoginModel({
            email: this.formGroup.controls['email'].value,
            password: this.formGroup.controls['password'].value
        });

        this.authService.login(loginInfo).subscribe({
            next: ((response: Account) => {
                if (this.resumeNavigation) {
                    this.router.navigateByUrl(this.returnUrl);
                } else {
                    this.router.navigateByUrl("/");
                }
            }),
            error: (error: HttpErrorResponse) => {
                switch (error.status) {
                    case 401:
                        if (error.error.includes("incorrect")) {
                            // wrong password / username
                            this.loginError = true;
                        } else {
                            // not activated or something else
                            this.accountError = true;
                            this.accountErrorMessage = error.error;
                        }
                        break;
                    case 404:
                        this.loginError = true;
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

    loginErrorTemp(): void {
        this.formSubmitting = false;
        this.loginError = true;
    }
}