import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { getValue } from '../../../../login/utilities';
import { Problem } from '../../../../models/Characters/problem.model';
import { ProblemOption } from '../../../../models/Humans/problemoption.model';
import { ProblemUpdateRequest } from '../../../../models/Humans/problemupdaterequest.model';
import { ProblemSource } from '../../../../models/System/problemsource.model';
import { CharacterAPIService } from '../../../services/characters.service';
import { HumanAPIService } from '../../../services/humans.service';

@Component({
    selector: 'app-problem-builder',
    imports: [CommonModule, MatButtonModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatCardModule],
    templateUrl: './problem-builder.component.html',
    styleUrl: './problem-builder.component.scss'
})
export class ProblemBuilderComponent {
    @Input() problem!: Problem;
    @Input() characterId?: string;
    @Output() problemRemoved = new EventEmitter<string>();
    characterAPI: CharacterAPIService = inject(CharacterAPIService);
    humanAPI: HumanAPIService = inject(HumanAPIService);
    selectedProblemSource: number = -1;
    selectedProblemEmotion: string = "-1";
    customProblemSource: string = "";
    customProblemEmotion: string = "";
    problemRank: number = 0;
    solved: boolean = false;
    getValue = getValue;

    constructor() {}

    getProblemValue(value: string, problemSources?: ProblemSource[]): number {
        if (!problemSources) {
            return -1;
        }

        const foundSource = problemSources.find(x => x.problemSource === value);

        if (foundSource) {
            this.selectedProblemSource = foundSource.rollValue;
        } else {
            this.selectedProblemSource = 99; // custom
        }

        return this.selectedProblemSource;
    }

    updateProblemSource(change: MatSelectChange): void {
        this.selectedProblemSource = change.value;

        let sourceText = "";

        if (this.selectedProblemSource !== 99) {
            const foundSource = this.characterAPI.rules?.problemSource.find(x => x.rollValue === this.selectedProblemSource);
            if (foundSource) {
                sourceText = foundSource.problemSource;
            }
        }

        this.sendProblemUpdate(sourceText);
    }

    customSourceUpdated(customSource: string): void {
        this.selectedProblemSource = 99; // jic

        this.sendProblemUpdate(customSource);
    }

    sendProblemUpdate(source: string): void {
        const request = new ProblemUpdateRequest({
            problemOption: ProblemOption.source,
            characterId: this.characterId,
            humanId: this.problem.humanId,
            problemId: this.problem.id,
            source: source
        });

        this.humanAPI.updateProblem(request).subscribe({
            next: (_: string) => {
                this.problem.source = source;
            }
        });

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
