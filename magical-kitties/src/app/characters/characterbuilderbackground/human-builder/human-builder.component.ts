import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { AfterContentInit, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, Observable } from 'rxjs';
import { Constants } from '../../../Constants';
import { getValue } from '../../../login/utilities';
import { DescriptionOption } from '../../../models/Characters/descriptionoption.model';
import { Human } from '../../../models/Characters/human.model';
import { Problem } from '../../../models/Characters/problem.model';
import { HumanUpdateRequest } from '../../../models/Humans/humanupdaterequest.model';
import { HumanAPIService } from '../../services/humans.service';
import { ProblemBuilderComponent } from "./problem-builder/problem-builder.component";

@Component({
    selector: 'app-human-builder',
    imports: [CommonModule, MatCardModule, MatIconModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule, ReactiveFormsModule, ProblemBuilderComponent, MatExpansionModule],
    templateUrl: './human-builder.component.html',
    styleUrl: './human-builder.component.scss'
})
export class HumanBuilderComponent implements AfterContentInit {
    @Input() human?: Human;
    @Output() humanRemoved = new EventEmitter<string>();
    getValue = getValue;
    Constants = Constants;
    humanAPI: HumanAPIService = inject(HumanAPIService);
    nameMaxCountSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    remainingNameCharacters$: Observable<number> = this.nameMaxCountSubject.asObservable();
    descriptionMaxCountSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    remainingDescriptionCharacters$: Observable<number> = this.descriptionMaxCountSubject.asObservable();

    constructor() {}

    ngAfterContentInit(): void {
        this.updateMaxName(new KeyboardEvent(""));
        this.updateMaxDescription();
    }

    updateMaxName(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.human) {
            return;
        }

        let maxCharacters = Constants.MaxCharactersSmallInput;
        if (this.human.name) {
            maxCharacters = maxCharacters - this.human.name.length;
        }

        this.nameMaxCountSubject.next(maxCharacters);
    }

    updateMaxDescription(): void {
        if (!this.human) {
            return;
        }

        let maxCharacters = Constants.MaxCharactersBigInput;
        if (this.human.description) {
            maxCharacters = maxCharacters - this.human.description.length;
        }

        this.descriptionMaxCountSubject.next(maxCharacters);
    }

    updateName(name: string): void {
        const request = new HumanUpdateRequest({
            option: DescriptionOption.name,
            characterId: this.human?.characterId,
            humanId: this.human?.id,
            name: name
        });

        this.humanAPI.update(request).subscribe({
            next: (_: string) => {
                this.human!.name = name;
            }
        })
    }

    updateDescription(description: string): void {
        const request = new HumanUpdateRequest({
            option: DescriptionOption.description,
            characterId: this.human?.characterId,
            humanId: this.human?.id,
            description: description
        });

        this.humanAPI.update(request).subscribe({
            next: (_: string) => {
                this.human!.description = description;
            }
        })
    }

    addNewProblem(): void {
        this.humanAPI.createProblem(this.human!.characterId, this.human!.id).subscribe({
            next: (problem: HttpResponse<Problem>) => {
                this.human?.problems.push(problem.body!);
            }
        });
    }

    removeHuman(): void {
        this.humanRemoved.next(this.human!.id);
    }

    removeProblem(problemId: string): void {
        this.humanAPI.removeProblem(this.human!.characterId, this.human!.id, problemId).subscribe({
            next: (_: string) => {
                const foundIndex = this.human!.problems.findIndex(x => x.id === problemId);

                if (foundIndex > -1) {
                    this.human!.problems.splice(foundIndex, 1);
                }
            }
        });
    }
}
