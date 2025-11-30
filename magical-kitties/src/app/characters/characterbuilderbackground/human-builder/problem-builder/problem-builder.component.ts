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
import { ProblemSource } from '../../../../models/System/problemsource.model';
import { trackByFn } from '../../../../utilities';
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
    selectedProblemSource: string = "";
    selectedProblemEmotion: string = "";
    customProblemSource: string = "";
    customProblemEmotion: string = "";
    problemRank: number = 0;
    solved: boolean = false;
    Constants = Constants;
    getValue = getValue;
    trackByFn = trackByFn;
    sourceMaxCountSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    remainingSourceCharacters$: Observable<number> = this.sourceMaxCountSubject.asObservable();
    emotionMaxCountSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    remainingEmotionCharacters$: Observable<number> = this.emotionMaxCountSubject.asObservable();

    constructor() {}

    ngAfterContentInit(): void {
        this.updateMaxSource();
        this.updateMaxEmotion();
    }

    getAlignmentCSS(source: string): string {
        if (source === 'Custom') {
            return "sm:justify-around";
        } else {
            return "sm:ml-[3.25rem]";
        }
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

    getProblemValue(value: string, problemSources?: ProblemSource[]): string {
        if (!problemSources || value === "") {
            return "";
        }

        const foundSource = problemSources.find(x => x.source === value);

        if (foundSource) {
            this.selectedProblemSource = foundSource.source;
        }

        return this.selectedProblemSource;
    }

    getEmotionValue(value: string, problemEmotions?: ProblemSource[]): string {
        if (!problemEmotions) {
            return "";
        }

        const foundEmotion = problemEmotions.find(x => x.source === value);

        if (foundEmotion) {
            this.selectedProblemEmotion = foundEmotion.source;
        }

        return this.selectedProblemEmotion;
    }

    updateProblemSource(change: MatSelectChange): void {
        this.selectedProblemSource = change.value;

        let sourceText = "";

        const foundSource = this.characterAPI.rules?.problemSource.find(x => x.source === this.selectedProblemSource);
        if (foundSource) {
            sourceText = foundSource.source;
        }

        this.sendProblemUpdate(sourceText);
    }

    customSourceUpdated(customSource: string): void {
        this.selectedProblemSource = "Custom"; // jic

        this.sendProblemUpdate(this.selectedProblemSource, customSource);
    }

    sendProblemUpdate(source: string, customSource?: string): void {
        const request = new ProblemUpdateRequest({
            problemOption: ProblemOption.source,
            characterId: this.characterId,
            humanId: this.problem.humanId,
            problemId: this.problem.id,
            source: source,
            customSource: customSource
        });

        this.humanAPI.updateProblem(request).subscribe({
            next: (_: string) => {
                this.problem.source = source;
                this.problem.customSource = customSource;
            }
        });
    }

    updateProblemEmotion(change: MatSelectChange): void {
        this.selectedProblemEmotion = change.value.toString();

        let emotionText = "";

        const foundEmotion = this.characterAPI.rules?.emotion.find(x => x.source === this.selectedProblemEmotion);
        if (foundEmotion) {
            emotionText = foundEmotion.source;
        }

        this.sendEmotionUpdate(emotionText);
    }

    customEmotionUpdated(source: string) {
        this.selectedProblemEmotion = "Custom" // jic

        this.sendEmotionUpdate(this.selectedProblemEmotion, source);
    }

    sendEmotionUpdate(emotion: string, customEmotion?: string): void {
        const request = new ProblemUpdateRequest({
            problemOption: ProblemOption.emotion,
            characterId: this.characterId,
            humanId: this.problem.humanId,
            problemId: this.problem.id,
            emotion: emotion,
            customSource: customEmotion
        });

        this.humanAPI.updateProblem(request).subscribe({
            next: (_: string) => {
                this.problem.emotion = emotion;
                this.problem.customEmotion = customEmotion
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
