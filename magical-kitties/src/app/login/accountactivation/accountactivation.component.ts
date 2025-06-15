import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountActivationResponse } from '../../models/Account/accountactivationresponse.model';
import { ValidationError } from '../../models/Errors/Error.model';
import { LoginAPIService } from '../services/login.service';

@Component({
    selector: 'app-accountactivation',
    imports: [CommonModule, RouterLink],
    templateUrl: './accountactivation.component.html',
    styleUrl: './accountactivation.component.scss'
})
export class AccountActivationComponent implements OnInit {
    username: string = "";
    activationCode: string = "";
    submitCodeInvalid: boolean = false;
    resendCodeInvalid: boolean = false;
    activationComplete: boolean = false;
    resendCodeComplete: boolean = false;
    private route: ActivatedRoute = inject(ActivatedRoute);
    private router: Router = inject(Router);
    private api: LoginAPIService = inject(LoginAPIService);
    constructor() {
        this.username = this.route.snapshot.params['username'];
        this.activationCode = this.route.snapshot.params['activationCode'];
    }

    ngOnInit(): void {
        // landed here by mistake, send them home.
        if (!this.username || this.username === "" || !this.activationCode || this.activationCode === "") {
            this.router.navigateByUrl('/');
        }

        this.api.activateAccount(this.username, this.activationCode).subscribe({
            next: (response: AccountActivationResponse) => {
                this.activationComplete = true;
            },
            error: (errorResponse: HttpErrorResponse) => {
                const error: ValidationError = errorResponse.error.errors[0];
                switch (error.propertyName.toLowerCase()) {
                    case "activationcode":
                        this.submitCodeInvalid = true;
                        break;
                    case "account":
                        this.router.navigateByUrl('/');
                        break;
                }
            }
        })
    }

    resendActivation() {
        this.submitCodeInvalid = false;
        this.resendCodeInvalid = false;
        this.api.resendActivation(this.username, this.activationCode).subscribe({
            next: (response: AccountActivationResponse) => {
                this.resendCodeComplete = true;
            },
            error: (errorResponse: HttpErrorResponse) => {
                const error = errorResponse.error.errors[0] as ValidationError;
                switch (error.propertyName.toLowerCase()) {
                    case "activationcode":
                        this.resendCodeInvalid = true;
                        break;
                    case "activationexpiration":
                        this.resendCodeComplete = true;
                        break;
                }
            }
        })
    }
}
