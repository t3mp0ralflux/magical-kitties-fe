
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PasswordResetRequest } from '../../models/Login/passwordreset.model';
import { AuthService } from '../../services/authService.service';

@Component({
    selector: 'app-forgotpassword',
    imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatInputModule],
    templateUrl: './forgotpassword.component.html',
    styleUrl: './forgotpassword.component.scss'
})
export class ForgotPasswordComponent {
    private authService: AuthService = inject(AuthService);
    private fb: FormBuilder = inject(FormBuilder);
    formGroup: FormGroup;
    emailSent: boolean = false;

    constructor() {
        this.formGroup = this.fb.group({
            email: new FormControl(null, [Validators.required, Validators.email]),
        })
    }

    submit(): void {
        const request = new PasswordResetRequest({
            email: this.formGroup.controls['email'].value,
            password: "",
            resetCode: ""
        });
        this.authService.forgotPassword(request).subscribe({
            next: (response) => {
                this.emailSent = true;
            },
            error: (error) => {
                //debugger;
            }
        })
    }
}
