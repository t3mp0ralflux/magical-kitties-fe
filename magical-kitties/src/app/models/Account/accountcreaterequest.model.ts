export class AccountCreateRequest {
    firstName!: string;
    lastName!: string;
    username!: string;
    email!: string;
    password!: string;

    constructor(init?: Partial<AccountCreateRequest>) {
        Object.assign(this, init);
    }
}