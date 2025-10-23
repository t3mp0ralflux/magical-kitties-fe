import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { getValue } from '../../../login/utilities';
import { Human } from '../../../models/Characters/human.model';
import { Problem } from '../../../models/Characters/problem.model';
import { ProblemBuilderComponent } from "./problem-builder/problem-builder.component";

@Component({
    selector: 'app-human-builder',
    imports: [CommonModule, MatCardModule, MatIconModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule, ProblemBuilderComponent],
    templateUrl: './human-builder.component.html',
    styleUrl: './human-builder.component.scss'
})
export class HumanBuilderComponent implements AfterContentInit {
    @Input() human!: Human;
    @Output() humanRemoved = new EventEmitter<string>();

    getValue = getValue;

    constructor() {}

    ngAfterContentInit(): void {
        // TODO: remove before flight, but correctly update fields before you do
        const newProblem = new Problem();
        newProblem.id = "TestProblemId";
        this.human.problems.push(newProblem);
    }

    updateName(name: string): void {
        // TODO: Send API call to update the name on this human
        console.log(`Human name is now ${name}`);
    }

    updateDescription(description: string): void {
        // TODO: same here. API.
        console.log('Human description updated');
    }

    addNewProblem(): void {
        // TODO: same here. API.
        const newProblem = new Problem();
        newProblem.humanId = this.human.id;

        this.human.problems.push(newProblem);
    }

    removeHuman(): void {
        this.humanRemoved.next(this.human.id);
    }

    removeProblem(problemId: string): void {
        // TODO: api to remove problem

        const foundIndex = this.human.problems.findIndex(x => x.id === problemId);

        if (foundIndex > -1) {
            this.human.problems.splice(foundIndex, 1);
        }
    }
}
