import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Constants } from '../Constants';
import { LoginResponse } from '../models/loginresponse.model';
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

    menuOpened(event: any) {
        this.menuOpen = event.value;
    }

    constructor(private router: ActivatedRoute, private authService: AuthService) {}

    ngOnInit(): void {
        this.router.params.subscribe({
            next: () => {
                // attempt to re-login if a valid token is present.
                if (this.authService.account === undefined) {
                    const token = sessionStorage.getItem(Constants.JWTToken);

                    if (token) {
                        this.authService.loginByToken(token).subscribe({
                            next: (result: LoginResponse) => {
                                this.authService.account = result.account;
                                sessionStorage.setItem(Constants.JWTToken, result.token); // refresh that thang.
                                this.loading = false;
                            }
                        });
                    } else {
                        this.loading = false;
                    }
                } else {
                    this.loading = false;
                }
            }
        })
    }
}
