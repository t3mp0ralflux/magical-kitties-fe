export class PasswordResetRequest {
    email: string = "";
    password: string = "";
    resetCode: string = "";

    constructor(init?: Partial<PasswordResetRequest>) {
        Object.assign(this, init);
    }
}