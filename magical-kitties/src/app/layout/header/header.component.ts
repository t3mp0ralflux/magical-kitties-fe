import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Account } from '../../models/Account/account.model';
import { AuthService } from '../../services/authService.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule, MatToolbarModule, MatDividerModule, MatButtonModule, MatMenuModule, MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    menuOpen: boolean = false;

    constructor(private router: Router, private authService: AuthService) {}

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

    navigate(desination: string): void {
        this.router.navigateByUrl(`/${desination}`);
    }

    logout(): void {
        this.authService.logout().subscribe({
            next: (response) => {
                this.authService.loggedOut.next(true);
            },
            error: (err) => {

            }
        });
    }

    checkButton(text: string): void {
        alert(text);
    }
}
