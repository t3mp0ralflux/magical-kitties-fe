import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MarkdownComponent } from "ngx-markdown";

@Component({
    selector: 'app-information-display',
    imports: [CommonModule, MatDialogModule, MatButtonModule, MarkdownComponent],
    templateUrl: './information-display.component.html',
    styleUrl: './information-display.component.scss'
})
export class InformationDisplayComponent implements AfterViewInit {
    data: any = inject(MAT_DIALOG_DATA);

    ngAfterViewInit(): void {
        if (this.data.anchor) {
            setTimeout(() => {
                const targetElement = document.getElementById(this.data.anchor);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "instant" });
                }
            });
        }
    }
}
