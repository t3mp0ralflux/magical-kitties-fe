import { Account } from "../Account/account.model";

export class LoginResponse {
    accessToken!: string;
    refreshToken!: string;
    account!: Account;
}