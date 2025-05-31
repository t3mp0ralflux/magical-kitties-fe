import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [CommonModule, MatToolbarModule, MatDivider, MatButton, MatMenuModule, MatIcon],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    menuOpen: boolean = false;

    constructor(private router: Router) {

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
}
