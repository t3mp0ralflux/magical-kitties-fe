export class LoginModel {
    email: string = "";
    password: string = "";
    twoFactorCode: string = "";
    twoFactorRecoveryCode: string = "";

    constructor(init?: Partial<LoginModel>) {
        Object.assign(this, init);
    }
}