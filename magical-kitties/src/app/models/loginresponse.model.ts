import { Account } from "./account.model";

export class LoginResponse {
    accessToken!: string;
    refreshToken!: string;
    account!: Account;
}