import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationExtras } from '../../models/Login/navigationExtras.model';
import { AuthService } from '../../services/authService.service';

@Component({
    selector: 'app-viewcharacters',
    imports: [MatButtonModule, MatCardModule, MatIconModule, MatFormFieldModule],
    templateUrl: './viewcharacters.component.html',
    styleUrl: './viewcharacters.component.scss'
})
export class ViewCharactersComponent implements OnDestroy {
    private router: Router = inject(Router);
    private authService: AuthService = inject(AuthService);
    loggedOutSubscription: Subscription;

    constructor() {
        this.loggedOutSubscription = this.authService.loggedOut.subscribe({
            next: () => {
                this.router.navigateByUrl("");
            }
        })
        if (this.authService.account === undefined) {
            const extras = new NavigationExtras({
                resumeUrl: "characters",
                resumeNavigation: true
            });

            this.router.navigateByUrl("/login", { state: extras });
        }
    }

    ngOnDestroy(): void {
        if (this.loggedOutSubscription) {
            this.loggedOutSubscription.unsubscribe();
        }
    }
}
