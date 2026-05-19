import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Constants } from '../../Constants';
import { Account } from '../../models/Account/account.model';
import { AccountStatus } from '../../models/Account/accountstatus.model';
import { NavigationExtras } from '../../models/Login/navigationExtras.model';
import { AuthService } from '../../services/authService.service';

declare const google: any;

@Component({
    selector: 'app-google',
    imports: [],
    templateUrl: './google.component.html',
    styleUrl: './google.component.scss'
})
export class GoogleComponent implements OnInit {

    router: Router = inject(Router);
    authService: AuthService = inject(AuthService);

    constructor() {}

    ngOnInit(): void {
        this.initializeGoogleSignIn();
    }

    initializeGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: environment.googleClientId,
            callback: (response: any) => this.handleCredentialResponse(response),
        });

        google.accounts.id.renderButton(
            document.getElementById('google-signin-button')!,
            { theme: 'outline', size: 'medium', type: 'standard' }
        );
    }

    handleCredentialResponse(response: any) {
        localStorage.setItem(Constants.JWTToken, response.credential);

        this.authService.loginByToken().subscribe({
            next: ((account: Account) => {
                if (account.accountStatus === AccountStatus.created) {
                    const extras = new NavigationExtras({
                        resumeNavigation: true // it really means "I've registered this account"
                    });

                    this.router.navigateByUrl("/register", { state: extras });
                } else {
                    this.router.navigateByUrl("/");
                }

            }),
            error: (err => {

            })
        })

    }

}
