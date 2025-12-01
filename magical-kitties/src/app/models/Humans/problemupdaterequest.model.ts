import { ProblemOption } from "./problemoption.model";

export class ProblemUpdateRequest {
    problemOption!: ProblemOption;
    characterId!: string;
    humanId!: string;
    problemId!: string;
    source?: string;
    emotion?: string;
    customSource?: string;
    rank?: number;
    solved?: boolean;

    constructor(init?: Partial<ProblemUpdateRequest>) {
        Object.assign(this, init);
    }
}