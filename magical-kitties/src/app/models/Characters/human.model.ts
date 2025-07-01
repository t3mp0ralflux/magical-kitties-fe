import { Problem } from "./problem.model";

export class Human {
    id!: string;
    characterId!: string;
    name!: string;
    description: string = ""
    problems: Problem[] = [];
}