import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [CommonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatInputModule, RouterLink, RouterLinkActive, MatProgressSpinnerModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    formGroup: FormGroup;
    formSubmitting: boolean = false;
    loginError: boolean = false;

    constructor(private fb: FormBuilder) {
        this.formGroup = fb.group({
            email: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required])
        })
    }

    login(): void {
        this.loginError = false;
        this.formSubmitting = true;
    }

    loginErrorTemp(): void {
        this.formSubmitting = false;
        this.loginError = true;
    }
}