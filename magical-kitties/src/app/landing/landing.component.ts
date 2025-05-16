import { Component } from '@angular/core';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatFormField, MatInput } from '@angular/material/input';

@Component({
    selector: 'app-landing',
    imports: [MatFormField, MatButton, MatFabButton, MatInput,],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.scss'
})
export class LandingComponent {

}
