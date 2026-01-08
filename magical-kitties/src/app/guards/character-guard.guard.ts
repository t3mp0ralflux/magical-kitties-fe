import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CharacterAPIService } from '../characters/services/characters.service';
import { Account } from '../models/Account/account.model';
import { NavigationExtras } from '../models/Login/navigationExtras.model';
import { AuthService } from '../services/authService.service';

export const CharacterGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const characterService = inject(CharacterAPIService);
    const router = inject(Router);

    const id = route.params["id"];

    const extras = new NavigationExtras({
        resumeUrl: `characters/${id}`,
        resumeNavigation: true
    });

    if (!authService.account) {
        authService.refreshLogin().subscribe({
            next: (_: Account) => {
                return true;
            },
            error: (err) => {
                router.navigateByUrl("/login", { state: extras });
            }
        });
    }

    characterService.getCharacterInformation(id).subscribe({
        next: (_) => {
            // Do nothing. getCharacterInformation() sets the character in the service.
        },
        error: (errorResponse) => {
            switch (errorResponse.status) {
                case 403:
                    return router.navigateByUrl("/forbidden", { replaceUrl: false, skipLocationChange: true });
                case 404:
                    return router.navigateByUrl("/not-found", { replaceUrl: false, skipLocationChange: true });
                default:
                    return router.navigateByUrl("");
            }
        }
    });

    return true;
};
