import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

@Component({
    selector: 'app-header',
    imports: [CommonModule, MatToolbar, MatToolbarRow, MatDivider, MatButton],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    showCharacters = false;
    fieldShown = "";
}
