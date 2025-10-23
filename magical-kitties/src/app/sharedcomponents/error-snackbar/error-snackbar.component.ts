import { Component, inject } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
    selector: 'app-error-snackbar',
    imports: [MatButtonModule],
    templateUrl: './error-snackbar.component.html',
    styleUrl: './error-snackbar.component.scss'
})
export class ErrorSnackbarComponent {
    private snackbarRef: MatSnackBarRef<ErrorSnackbarComponent> = inject(MatSnackBarRef<ErrorSnackbarComponent>);
    data: string = inject(MAT_SNACK_BAR_DATA);

    close(): void {
        this.snackbarRef.dismiss();
    }

    doAction(): void {
        this.snackbarRef.dismissWithAction();
    }
}
