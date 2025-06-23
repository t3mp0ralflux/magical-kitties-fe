import { Component, inject } from '@angular/core';
import { MatCard, MatCardContent, MatCardImage } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing',
    imports: [MatCard, MatCardContent, MatCardImage],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.scss'
})
export class LandingComponent {
    private router: Router = inject(Router);

    navigateToCharacters(): void {
        this.router.navigateByUrl('characters');
    }
}
