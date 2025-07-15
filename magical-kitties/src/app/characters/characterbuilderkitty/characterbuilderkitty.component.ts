import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Character } from '../../models/Characters/character.model';
import { CharacterAPIService } from '../services/characters.service';

@Component({
    selector: 'app-characterbuilderkitty',
    imports: [CommonModule, MatDividerModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
    templateUrl: './characterbuilderkitty.component.html',
    styleUrl: './characterbuilderkitty.component.scss'
})
export class CharacterBuilderKittyComponent {
    characterApi: CharacterAPIService = inject(CharacterAPIService);
    character?: Character;
    levelOptions: number[] = Array(10).fill(1).map((_, i) => i + 1);
    levelControl: FormControl = new FormControl();

    constructor() {
        this.characterApi.character$.subscribe({
            next: ((character: Character | undefined) => {
                this.character = character;

                this.levelControl.setValue(character?.level);
            })
        })
    }

    updateLevel(event: MatSelectChange) {
        if (event.value < this.character!.level) {
            alert("Going down!");
        }
        // TODO: call api and update level, then make the magic happen to update ALL the things below the level line.
    }
}
