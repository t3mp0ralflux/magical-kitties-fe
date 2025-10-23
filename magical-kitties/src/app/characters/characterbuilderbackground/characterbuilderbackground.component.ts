import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Character } from '../../models/Characters/character.model';
import { Human } from '../../models/Characters/human.model';
import { HumanBuilderComponent } from "./human-builder/human-builder.component";

@Component({
    selector: 'app-characterbuilderbackground',
    imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule, HumanBuilderComponent],
    templateUrl: './characterbuilderbackground.component.html',
    styleUrl: './characterbuilderbackground.component.scss'
})
export class CharacterBuilderBackgroundComponent {
    hometownControl: FormControl = new FormControl();
    kittyDescriptionControl: FormControl = new FormControl();
    character: Character;
    humanCount: number = 0;

    constructor() {
        // TODO: remove before flight
        this.character = new Character();
        this.character.id = "12345";

        const tempHuman = new Human();
        tempHuman.characterId = this.character.id;
        tempHuman.id = "TestHuman";
        tempHuman.name = "Biscuit";
        tempHuman.problems = [];

        this.character.human = [tempHuman];
    }

    updateHometown(): void {
        console.log("hometown updated");
    }

    updateKittyDescription(): void {
        console.log("kitty description updated");
    }

    addNewHuman(): void {
        // TODO: call the API and add human, then take the result and add to current character.
        const newHuman = new Human();
        const number = Math.floor(Math.random() * 100);
        newHuman.name = `Human ${number}`;
        this.character.human.push(newHuman);
    }

    removeHuman(id: any) {
        // TODO: call the API and remove, then remove locally
        const foundHumanIndex = this.character.human.findIndex(x => x.id === id);

        if (foundHumanIndex > -1) {
            this.character.human.splice(foundHumanIndex, 1);
        }
    }
}
