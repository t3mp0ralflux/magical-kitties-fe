import { Component, Input } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
    selector: 'app-info-box',
    imports: [MarkdownComponent],
    templateUrl: './info-box.component.html',
    styleUrl: './info-box.component.scss',
})
export class InfoBoxComponent {
    @Input() title!: string;
    @Input() secondaryTitle?: string;
    @Input() hasStars: boolean = true;
    @Input() data: any[] = [];
}
