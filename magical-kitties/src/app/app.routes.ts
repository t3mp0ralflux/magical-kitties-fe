import { Routes } from '@angular/router';
import { authGuard } from './auth-guard.guard';
import { LandingComponent } from './landing/landing.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginLayoutComponent } from './login/layout/loginlayout.component';
import { LoginComponent } from './login/login/login.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: LandingComponent, canActivate: [authGuard] }
        ]
    },
    {
        path: 'login',
        component: LoginLayoutComponent,
        children: [
            { path: '', component: LoginComponent },
        ]
    },
    // {
    //     path: 'forgot-password',
    //     component: LoginLayoutComponent,
    //     children: [
    //         { path: '', component: ForgotPasswordComponent}
    //     ]
    // }
];
