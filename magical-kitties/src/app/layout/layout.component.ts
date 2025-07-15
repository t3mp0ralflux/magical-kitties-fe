import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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
export class LayoutComponent implements OnInit {
    menuOpen: boolean = false;
    loading: boolean = true;
    private route: ActivatedRoute = inject(ActivatedRoute);
    private authService: AuthService = inject(AuthService);

    menuOpened(event: any) {
        this.menuOpen = event.value;
    }

    ngOnInit(): void {
        this.route.params.subscribe({
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
        })
    }
}
