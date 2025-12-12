import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { Account } from '../models/Account/account.model';
import { AuthService } from '../services/authService.service';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy {
    menuOpen: boolean = false;
    loading: boolean = true;
    route: ActivatedRoute = inject(ActivatedRoute);
    authService: AuthService = inject(AuthService);
    subscriptions: Subscription[] = [];

    menuOpened(event: any) {
        this.menuOpen = event.value;
    }

    ngOnInit(): void {
        const routeSubscription = this.route.params.subscribe({
            next: () => {
                // attempt to re-login if a valid token is present.
                if (this.authService.account === undefined) {
                    this.authService.refreshLogin().subscribe({
                        next: (response: Account) => {
                            this.loading = false;
                        },
                        error: (err) => {
                            this.loading = false;
                        },
                        complete: () => {
                            this.loading = false;
                        }
                    });
                } else {
                    this.loading = false;
                }
            },
            error: (err) => {
                console.log("route params error " + err);
            }
        });

        this.subscriptions.push(routeSubscription);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        })
    }
}
