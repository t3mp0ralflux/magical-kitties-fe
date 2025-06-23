import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LayoutComponent } from './layout/layout.component';
import { AccountActivationComponent } from './login/accountactivation/accountactivation.component';
import { ForgotPasswordComponent } from './login/forgotpassword/forgotpassword.component';
import { LoginLayoutComponent } from './login/layout/loginlayout.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { ResetPasswordComponent } from './login/resetpassword/resetpassword.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: LandingComponent }
        ]
    },
    {
        path: 'login',
        component: LoginLayoutComponent,
        children: [
            { path: '', component: LoginComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password/:encodedInfo', component: ResetPasswordComponent },
        ]
    },
    {
        path: 'register',
        component: LoginLayoutComponent,
        children: [
            { path: '', component: RegisterComponent },
            { path: 'activation/:encodedInfo', component: AccountActivationComponent },
            { path: 'activation/resend/:encodedInfo', component: AccountActivationComponent }
        ]
    },
    // {
    //     path: '**',
    //     redirectTo: '',
    //     pathMatch: 'full'
    // }
];
