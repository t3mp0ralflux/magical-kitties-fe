import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Constants } from '../Constants';
import { LoginResponse } from '../models/Login/loginresponse.model';
import { TokenRequest } from '../models/Login/tokenrequest.model';
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
                    const request = new TokenRequest({
                        accessToken: localStorage.getItem(Constants.JWTToken)!,
                        refreshToken: localStorage.getItem(Constants.RefreshToken)!
                    });

                    if (request.accessToken && request.refreshToken) {
                        this.authService.loginByToken(request).subscribe({
                            next: (result: LoginResponse) => {
                                this.authService.account = result.account;
                                localStorage.setItem(Constants.JWTToken, result.accessToken); // refresh that thang.
                                localStorage.setItem(Constants.RefreshToken, result.refreshToken);
                                this.loading = false;
                            },
                            error: (err) => {
                                localStorage.clear();
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
