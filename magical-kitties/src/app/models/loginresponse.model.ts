import { Account } from "./account.model";

export class LoginResponse {
    token!: string;
    account!: Account;
}