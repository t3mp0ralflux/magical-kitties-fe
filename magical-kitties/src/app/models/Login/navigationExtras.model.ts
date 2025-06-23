export class NavigationExtras {
    resumeNavigation: boolean = false;
    resumeUrl: string = "";

    constructor(init?: Partial<NavigationExtras>) {
        Object.assign(this, init);
    }
}