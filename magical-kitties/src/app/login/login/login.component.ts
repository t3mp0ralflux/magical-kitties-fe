import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginModel } from '../../models/login.model';
import { AuthService } from '../../services/authService.service';
import { GoogleComponent } from "../google/google.component";

@Component({
    selector: 'app-login',
    imports: [CommonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatInputModule, RouterLink, RouterLinkActive, MatProgressSpinnerModule, MatIconModule, GoogleComponent, MatDividerModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    formGroup: FormGroup;
    formSubmitting: boolean = false;
    loginError: boolean = false;
    hidePassword: boolean = true;

    private _snackBar = inject(MatSnackBar);

    constructor(
        private fb: FormBuilder,
        private authSerivce: AuthService,
        private router: Router) {
        this.formGroup = fb.group({
            email: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required])
        })
    }

    openSnackBar(message: string, action: string) {
        let snackBar: MatSnackBarRef<TextOnlySnackBar> = this._snackBar.open(message, action, {
        });
        snackBar.onAction().subscribe({
            next: (thing: any) => {
                this.login();
            }
        })
    }

    login(): void {
        this.formSubmitting = true;
        this.loginError = false;

        const loginInfo = new LoginModel({
            email: this.formGroup.controls['email'].value,
            password: this.formGroup.controls['password'].value
        });

        this.authSerivce.login(loginInfo).subscribe({
            next: () => {
                this.router.navigateByUrl("/");
            },
            error: (error: any) => {
                switch (error.status) {
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