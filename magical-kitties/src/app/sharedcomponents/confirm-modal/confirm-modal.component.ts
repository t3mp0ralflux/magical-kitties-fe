import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-modal',
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    templateUrl: './confirm-modal.component.html',
    styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
    data: any = inject(MAT_DIALOG_DATA);
}
