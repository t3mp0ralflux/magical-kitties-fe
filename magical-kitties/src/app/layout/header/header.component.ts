import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-header',
    imports: [CommonModule, MatToolbarModule, MatDivider, MatButton, MatMenuModule, MatIcon],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    menuOpen: boolean = false;
    @Output() openedMenu = new EventEmitter<boolean>();

    toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
        this.openedMenu.emit(this.menuOpen);
    }
}
