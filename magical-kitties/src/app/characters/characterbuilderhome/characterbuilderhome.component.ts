import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CharacterAPIService } from '../services/characters.service';
@Component({
    selector: 'app-characterbuilderhome',
    imports: [CommonModule, MatCheckboxModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule],
    templateUrl: './characterbuilderhome.component.html',
    styleUrl: './characterbuilderhome.component.scss'
})
export class CharacterBuilderHomeComponent {
    characterApi: CharacterAPIService = inject(CharacterAPIService);
    //advancementType: FormControl = new FormControl("milestone"); // TODO: make this based on the character.

    constructor() {
    }
}
