
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GetAllCharactersResponse } from '../../../models/Characters/getallcharactersresponse.model';

@Component({
    selector: 'app-delete-modal',
    imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './delete-modal.component.html',
    styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {
    data: GetAllCharactersResponse = inject(MAT_DIALOG_DATA);
    private fb: FormBuilder = inject(FormBuilder);
    formGroup: FormGroup;

    constructor() {
        this.formGroup = this.fb.group(
            {
                name: new FormControl("", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z].)(?=.*[@$!%*#?&^_-]).{8,}/)])
            },
            {
                validators: this.matchNameValidator()
            })
    }

    matchNameValidator(): ValidatorFn {
        return (abstractControl: AbstractControl) => {
            const control = abstractControl.get('name');

            if (control!.value !== this.data.name) {
                const error = { confirmedValidator: true };
                control!.setErrors(error);
                return error;
            } else {
                control!.setErrors(null);
                return null;
            }
        }
    };
}
