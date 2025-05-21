import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

@Component({
    selector: 'app-header',
    imports: [CommonModule, MatToolbar, MatToolbarRow, MatDivider, MatButton, MatMenu, MatMenuTrigger, MatCard, MatCardContent, MatIcon],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    showCharacters = false;
    fieldShown = "";
}
