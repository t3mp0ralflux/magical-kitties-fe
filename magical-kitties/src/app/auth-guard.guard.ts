import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { NavigationExtras } from './models/Login/navigationExtras.model';
import { AuthService } from './services/authService.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
    private authService: AuthService = inject(AuthService);
    private router: Router = inject(Router);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        if (this.authService.account === undefined) {
            const extras = new NavigationExtras({
                resumeUrl: route.routeConfig?.path,
                resumeNavigation: true
            });
            this.router.navigateByUrl("/login", { state: extras });
            return false;
        }

        return true;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        if (this.authService.account === undefined) {
            const extras = new NavigationExtras({
                resumeUrl: childRoute.routeConfig?.path,
                resumeNavigation: true
            });
            this.router.navigateByUrl("/login", { state: extras });
            return false;
        }

        return true;
    }
}
