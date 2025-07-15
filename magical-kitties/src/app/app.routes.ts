import { Routes } from '@angular/router';
import { BuilderlayoutComponent } from './characters/builderlayout/builderlayout.component';
import { CharacterBuilderBackgroundComponent } from './characters/characterbuilderbackground/characterbuilderbackground.component';
import { CharacterBuilderHomeComponent } from './characters/characterbuilderhome/characterbuilderhome.component';
import { CharacterBuilderHumanComponent } from './characters/characterbuilderhuman/characterbuilderhuman.component';
import { CharacterBuilderKittyComponent } from './characters/characterbuilderkitty/characterbuilderkitty.component';
import { DisplayCharacterComponent } from './characters/displaycharacter/displaycharacter.component';
import { ViewCharactersComponent } from './characters/viewcharacters/viewcharacters.component';
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
    {
        path: 'characters',
        component: LayoutComponent,
        children: [
            { path: '', component: ViewCharactersComponent },
            { path: ':id', component: DisplayCharacterComponent },

        ]
    },
    {
        path: 'characters/:id/builder',
        component: BuilderlayoutComponent,
        children: [
            { path: "", component: CharacterBuilderHomeComponent },
            { path: "kitty", component: CharacterBuilderKittyComponent },
            { path: "background", component: CharacterBuilderBackgroundComponent },
            { path: "human", component: CharacterBuilderHumanComponent }
        ]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
