import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-copy-modal',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './copy-modal.component.html',
    styleUrl: './copy-modal.component.scss'
})
export class CopyCharacterModalComponent {

}
