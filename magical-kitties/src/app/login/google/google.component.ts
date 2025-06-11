import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Constants } from '../../Constants';

declare const google: any;

@Component({
    selector: 'app-google',
    imports: [],
    templateUrl: './google.component.html',
    styleUrl: './google.component.scss'
})
export class GoogleComponent implements OnInit {

    constructor(private router: Router) {}

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
            { theme: 'outline', size: 'large', type: 'standard' }
        );

        google.accounts.id.prompt();
    }

    handleCredentialResponse(response: any) {
        localStorage.setItem(Constants.JWTToken, response.credential);
        this.router.navigateByUrl("/");
    }

}
