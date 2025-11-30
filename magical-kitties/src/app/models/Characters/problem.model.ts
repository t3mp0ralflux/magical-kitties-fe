export class Problem {
    id!: string;
    humanId!: string;
    source!: string;
    customSource?: string;
    emotion!: string;
    customEmotion?: string;
    rank!: number
    solved!: boolean;
}