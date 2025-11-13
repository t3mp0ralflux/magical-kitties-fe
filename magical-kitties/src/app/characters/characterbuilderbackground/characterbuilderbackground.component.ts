import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { AfterContentInit, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { getValue } from '../../login/utilities';
import { Character } from '../../models/Characters/character.model';
import { DescriptionOption } from '../../models/Characters/descriptionoption.model';
import { DescriptionUpdateRequest } from '../../models/Characters/descriptionupdaterequest.model';
import { Human } from '../../models/Characters/human.model';
import { CharacterAPIService } from '../services/characters.service';
import { HumanAPIService } from '../services/humans.service';
import { HumanBuilderComponent } from "./human-builder/human-builder.component";

@Component({
    selector: 'app-characterbuilderbackground',
    imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule, HumanBuilderComponent, MatExpansionModule],
    templateUrl: './characterbuilderbackground.component.html',
    styleUrl: './characterbuilderbackground.component.scss'
})
export class CharacterBuilderBackgroundComponent implements AfterContentInit {
    hometownControl: FormControl = new FormControl();
    kittyDescriptionControl: FormControl = new FormControl();
    characterAPI: CharacterAPIService = inject(CharacterAPIService);
    humanAPI: HumanAPIService = inject(HumanAPIService);
    character?: Character;
    getValue = getValue;

    constructor() {}

    ngAfterContentInit(): void {
        this.characterAPI.character$.subscribe({
            next: (character: Character | undefined) => {
                if (character) {
                    this.character = character
                }
            }
        });
    }

    updateHometown(hometown: string): void {
        const payload = new DescriptionUpdateRequest({
            characterId: this.character!.id,
            hometown: hometown
        });

        this.characterAPI.updateDescription(DescriptionOption.hometown, payload).subscribe({
            next: (_: string) => {
                this.character!.hometown = hometown;
            }
        });
    }

    updateKittyDescription(description: string): void {
        const payload = new DescriptionUpdateRequest({
            characterId: this.character!.id,
            description: description
        });

        this.characterAPI.updateDescription(DescriptionOption.description, payload).subscribe({
            next: (_: string) => {
                this.character!.description = description;
            }
        })
    }

    addNewHuman(): void {
        this.characterAPI.addHuman(this.character!.id).subscribe({
            next: (response: HttpResponse<Human>) => {
                this.character!.humans ?? [];

                this.character!.humans.push(response.body!);
            }
        });
    }

    removeHuman(id: string): void {
        this.characterAPI.removeHuman(this.character!.id, id).subscribe({
            next: (_: any) => {
                const foundHumanIndex = this.character!.humans.findIndex(x => x.id === id);

                if (foundHumanIndex >= 0) {
                    this.character!.humans.splice(foundHumanIndex, 1);
                }
            },
            error: (err: any) => {
                debugger;
            }
        })
    }
}
