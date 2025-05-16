import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'Landing', pathMatch: 'full' },
            { path: 'Landing', component: LandingComponent }
        ]
    },
    // {
    //     path: 'Login',
    //     component: LoginComponent
    // }
];
