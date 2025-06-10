export class TokenRequest {
    accessToken!: string;
    refreshToken!: string;

    constructor(init?: Partial<TokenRequest>) {
        Object.assign(this, init);
    }
}