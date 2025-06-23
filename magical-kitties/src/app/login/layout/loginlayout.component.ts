import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-login-layout',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './loginlayout.component.html',
    styleUrl: './loginlayout.component.scss'
})
export class LoginLayoutComponent {

}
