import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetRequest } from '../../models/Login/passwordreset.model';
import { PasswordResetResponse } from '../../models/Login/passwordresetresponse.model';
import { AuthService } from '../../services/authService.service';
import { MatchValidator } from '../utilities';

@Component({
    selector: 'app-resetpassword',
    imports: [CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
    templateUrl: './resetpassword.component.html',
    styleUrl: './resetpassword.component.scss'
})
export class ResetPasswordComponent implements OnInit {
    showForm: boolean = false;
    email: string;
    resetCode: string;
    hidePassword: boolean = true;
    hideResetPassword: boolean = true;
    resetSuccess: boolean = false;
    formGroup: FormGroup;

    private route: ActivatedRoute = inject(ActivatedRoute);
    private router: Router = inject(Router);
    private authService: AuthService = inject(AuthService);
    private fb: FormBuilder = inject(FormBuilder);

    constructor() {
        const encodedInfo = this.route.snapshot.params['encodedInfo'];
        const decodedInfo = atob(encodedInfo).split(';');

        this.email = decodedInfo[0];
        this.resetCode = decodedInfo[1];

        this.formGroup = this.fb.group({
            password: new FormControl("", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z].)(?=.*[@$!%*#?&^_-]).{8,}/)]),
            passwordReEnter: new FormControl("", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z].)(?=.*[@$!%*#?&^_-]).{8,}/)])
        },
            {
                validators: MatchValidator('password', 'passwordReEnter')
            })
    }

    ngOnInit(): void {
        const resetInfo = new PasswordResetRequest({ email: this.email, resetCode: this.resetCode });
        this.authService.verifyPasswordReset(resetInfo).subscribe({
            next: (response) => {
                this.showForm = true;
            },
            error: (error: HttpErrorResponse) => {
                this.router.navigateByUrl('/');
            }
        });
    }

    submit(): void {
        const resetRequest = new PasswordResetRequest({ email: this.email, password: this.formGroup.controls['password'].value, resetCode: this.resetCode })
        this.authService.passwordReset(resetRequest).subscribe({
            next: (response: PasswordResetResponse) => {
                this.showForm = false;
                this.resetSuccess = true;
            },
            error: (error: HttpErrorResponse) => {
                // TODO: do something here
            }
        })
    }
}
