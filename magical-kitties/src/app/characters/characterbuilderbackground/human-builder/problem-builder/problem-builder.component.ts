import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { getValue } from '../../../../login/utilities';
import { Problem } from '../../../../models/Characters/problem.model';
import { CharacterAPIService } from '../../../services/characters.service';

@Component({
    selector: 'app-problem-builder',
    imports: [CommonModule, MatButtonModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatCardModule],
    templateUrl: './problem-builder.component.html',
    styleUrl: './problem-builder.component.scss'
})
export class ProblemBuilderComponent implements AfterContentInit {
    @Input() problem!: Problem;
    @Output() problemRemoved = new EventEmitter<string>();
    characterAPI: CharacterAPIService = inject(CharacterAPIService);
    selectedProblemSource: number = -1;
    selectedProblemEmotion: string = "-1";
    customProblemSource: string = "";
    customProblemEmotion: string = "";
    problemRank: number = 0;
    solved: boolean = false;
    getValue = getValue;

    constructor() {}
    ngAfterContentInit(): void {

    }

    updateProblemSource(change: MatSelectChange): void {
        this.selectedProblemSource = change.value;

        if (this.selectedProblemSource === 99) {
            // TODO: submit custom problem source text
            console.log("Source updated to custom");
        } else {
            // TODO: submit pre-made problem source text.
            this.customProblemSource = ""; // empty to prevent leftovers
            const foundSource = this.characterAPI.rules?.problemSource.find(x => x.rollValue === change.value);
            if (foundSource) {
                console.log(`Source updated to ${foundSource.problemSource}`);
            }
        }
    }

    customSourceUpdated(source: string) {
        console.log(`Custom source is now ${source}`);
    }

    updateProblemEmotion(change: MatSelectChange): void {
        this.selectedProblemEmotion = change.value.toString();
        if (this.selectedProblemEmotion === "99") {
            // TODO: submit custom problem emotion text
            console.log("Emotion updated to custom");
        } else {
            // TODO: submit pre-made problem emotion text.
            this.customProblemEmotion = ""; // empty to prevent leftovers
            const foundEmotion = this.characterAPI.rules?.emotion.find(x => x.rollValue === change.value);
            if (foundEmotion) {
                console.log(`Emotion updated to ${foundEmotion.emotionSource}`);
            }
        }
    }

    customEmotionUpdated(source: string) {
        console.log(`Custom emotion is now ${source}`);
    }

    removeProblem(): void {
        this.problemRemoved.next(this.problem.id);
    }

    updateRank(rank: string) {
        // TODO: api
        const numberRank = Number(rank);
        console.log(`Rank is now ${numberRank}`);
        this.problem.rank = numberRank;
    }

    updateSolved(change: MatSelectChange): void {
        // TODO: api
        console.log(`Problem solved: ${change.value}`);
        this.problem.solved = change.value;
    }
}
