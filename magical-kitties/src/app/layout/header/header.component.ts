import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Account } from '../../models/account.model';
import { AuthService } from '../../services/authService.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule, MatToolbarModule, MatDividerModule, MatButtonModule, MatMenuModule, MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    menuOpen: boolean = false;

    constructor(private router: Router, private authService: AuthService) {
        // TODO: AuthGuard needs to check token. If token is still valid, get the account, populate the authService, move along.
        // TODO: Need a refresh token method cause it'd be ass to login every thirty minutes. Should refresh for like 7 days and a checkbox for "Remember Me" for 30 days or so.
    }

    get account(): Account | undefined {
        return this.authService.account;
    }

    toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
        document.getElementById("minimenu-container")?.classList.toggle("invisible");
        document.getElementById("minimenu-bg")?.classList.toggle("opacity-0");
        document.getElementById("minimenu-bg")?.classList.toggle("opacity-50");
        document.getElementById("minimenu")?.classList.toggle("translate-x-full");
    }

    navigateToLogin(): void {
        this.router.navigateByUrl('/login');
    }

    logout(): void {
        this.authService.logout();
    }

    checkButton(text: string): void {
        alert(text);
    }
}
