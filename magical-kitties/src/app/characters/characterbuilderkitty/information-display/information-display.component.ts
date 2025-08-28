import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MarkdownComponent } from "ngx-markdown";
import { Endowment } from '../../../models/Characters/endowment.model';

@Component({
    selector: 'app-information-display',
    imports: [CommonModule, MatDialogModule, MatButtonModule, MarkdownComponent],
    templateUrl: './information-display.component.html',
    styleUrl: './information-display.component.scss'
})
export class InformationDisplayComponent {
    data: Endowment[] = inject(MAT_DIALOG_DATA);
}
