import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, Observable } from 'rxjs';
import { Constants } from '../../../../Constants';
import { getValue } from '../../../../login/utilities';
import { Problem } from '../../../../models/Characters/problem.model';
import { ProblemOption } from '../../../../models/Humans/problemoption.model';
import { ProblemUpdateRequest } from '../../../../models/Humans/problemupdaterequest.model';
import { Emotion } from '../../../../models/System/emotion.model';
import { ProblemSource } from '../../../../models/System/problemsource.model';
import { CharacterAPIService } from '../../../services/characters.service';
import { HumanAPIService } from '../../../services/humans.service';

@Component({
    selector: 'app-problem-builder',
    imports: [CommonModule, MatButtonModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatIconModule, FormsModule, ReactiveFormsModule, MatCardModule],
    templateUrl: './problem-builder.component.html',
    styleUrl: './problem-builder.component.scss'
})
export class ProblemBuilderComponent implements AfterContentInit {
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
    Constants = Constants;
    getValue = getValue;
    sourceMaxCountSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    remainingSourceCharacters$: Observable<number> = this.sourceMaxCountSubject.asObservable();
    emotionMaxCountSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    remainingEmotionCharacters$: Observable<number> = this.emotionMaxCountSubject.asObservable();

    constructor() {}

    ngAfterContentInit(): void {
        this.updateMaxSource();
        this.updateMaxEmotion();
    }

    updateMaxSource(): void {
        if (!this.problem) {
            return;
        }

        let maxCharacters = Constants.MaxCharactersSmallInput;
        if (this.problem.source) {
            maxCharacters = maxCharacters - this.problem.source.length;
        }

        this.sourceMaxCountSubject.next(maxCharacters);
    }

    updateMaxEmotion(): void {
        if (!this.problem) {
            return;
        }

        let maxCharacters = Constants.MaxCharactersSmallInput;
        if (this.problem.emotion) {
            maxCharacters = maxCharacters - this.problem.emotion.length;
        }

        this.emotionMaxCountSubject.next(maxCharacters);
    }

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

    getEmotionValue(value: string, problemEmotions?: Emotion[]): string {
        if (!problemEmotions) {
            return "-1";
        }

        const foundEmotion = problemEmotions.find(x => x.emotionSource === value);

        if (foundEmotion) {
            this.selectedProblemEmotion = foundEmotion.rollValue;
        } else {
            this.selectedProblemEmotion = "99" // custom
        }

        return this.selectedProblemEmotion;
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

        let emotionText = "";

        if (this.selectedProblemEmotion !== "99") {
            const foundEmotion = this.characterAPI.rules?.emotion.find(x => x.rollValue === this.selectedProblemEmotion);
            if (foundEmotion) {
                emotionText = foundEmotion.emotionSource;
            }
        }

        this.sendEmotionUpdate(emotionText);
    }

    customEmotionUpdated(source: string) {
        this.selectedProblemEmotion = "99" // jic

        this.sendEmotionUpdate(source);
    }

    sendEmotionUpdate(emotion: string): void {
        const request = new ProblemUpdateRequest({
            problemOption: ProblemOption.emotion,
            characterId: this.characterId,
            humanId: this.problem.humanId,
            problemId: this.problem.id,
            emotion: emotion
        });

        this.humanAPI.updateProblem(request).subscribe({
            next: (_: string) => {
                this.problem.emotion = emotion;
            }
        });
    }

    removeProblem(): void {
        this.problemRemoved.next(this.problem.id);
    }

    updateRank(rank: string) {
        const numberRank = Number(rank);

        const request = new ProblemUpdateRequest({
            problemOption: ProblemOption.rank,
            characterId: this.characterId,
            humanId: this.problem.humanId,
            problemId: this.problem.id,
            rank: numberRank
        });

        this.humanAPI.updateProblem(request).subscribe({
            next: (_: string) => {
                this.problem.rank = numberRank;
            }
        });
    }

    updateSolved(change: MatSelectChange): void {
        const booleanValue = JSON.parse(change.value);

        const request = new ProblemUpdateRequest({
            problemOption: ProblemOption.solved,
            characterId: this.characterId,
            humanId: this.problem.humanId,
            problemId: this.problem.id,
            solved: booleanValue
        });

        this.humanAPI.updateProblem(request).subscribe({
            next: (_: string) => {
                this.problem.solved = booleanValue;
            }
        });
    }
}
