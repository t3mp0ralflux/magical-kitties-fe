import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardImage } from '@angular/material/card';

@Component({
    selector: 'app-landing',
    imports: [MatCard, MatCardContent, MatCardImage],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.scss'
})
export class LandingComponent {

}
