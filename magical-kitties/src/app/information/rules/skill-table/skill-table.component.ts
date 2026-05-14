import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-skill-table',
    imports: [MatTableModule],
    templateUrl: './skill-table.component.html',
    styleUrl: './skill-table.component.scss',
})
export class SkillTableComponent {
    @Input() data!: any[];
    @Input() displayedColumns!: string[];
}
