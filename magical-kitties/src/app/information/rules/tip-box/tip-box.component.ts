import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tip-box',
    imports: [CommonModule],
    templateUrl: './tip-box.component.html',
    styleUrl: './tip-box.component.scss',
})
export class TipBoxComponent {
    @Input() title!: string;
    @Input() body!: string;
    @Input() onLeft: boolean = true;
}
