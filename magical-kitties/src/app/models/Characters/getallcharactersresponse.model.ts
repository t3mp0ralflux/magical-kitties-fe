export class GetAllCharactersResponse {
    id!: string;
    accountId!: string;
    username!: string;
    name!: string;
    level!: number;
    magicalPowers: string[] = [];
    humanName!: string | null;
}