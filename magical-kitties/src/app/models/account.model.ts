import { AccountRole } from "./accountrole.model";
import { AccountStatus } from "./accountstatus.model";

export class Account {
    id!: string;
    firstName!: string;
    lastName!: string;
    userName!: string;
    email!: string;
    accountStatus!: AccountStatus;
    accountRole!: AccountRole;
    lastLogin!: Date;

    constructor(init?: Partial<Account>) {
        Object.assign(this, init);
    }
}