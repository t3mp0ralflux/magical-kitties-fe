import { Component, inject } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MarkdownService } from 'ngx-markdown';
import { CharacterAPIService } from '../../characters/services/characters.service';

@Component({
    selector: 'app-rules',
    imports: [MatIconModule, MatTabsModule, MatTableModule],
    templateUrl: './rules.component.html',
    styleUrl: './rules.component.scss',
})
export class RulesComponent {
    characterAPI: CharacterAPIService = inject(CharacterAPIService);
    markdownService: MarkdownService = inject(MarkdownService);
    displayedColumns: string[] = ["id", "name"];
    readonly ROWS_PER_COL = 12;
    displayedColumns2: string[] = [];

    ngOnInit(): void {
        if (!this.characterAPI.rules) {
            this.characterAPI.getRules().subscribe();
        }
    }

    getTableData(data: any[]): any[][] {
        const numCols = Math.ceil(data.length / this.ROWS_PER_COL);

        // Build column groups
        const chunks: (any | null)[][] = [];
        for (let i = 0; i < numCols; i++) {
            const chunk = data.slice(i * this.ROWS_PER_COL, (i + 1) * this.ROWS_PER_COL);
            // Pad shorter last column with nulls
            while (chunk.length < this.ROWS_PER_COL) chunk.push({});
            chunks.push(chunk);
        }

        // Transpose: rows become [col0[r], col1[r], col2[r], ...]
        const transposedData = Array.from({ length: this.ROWS_PER_COL }, (_, r) =>
            chunks.map(col => col[r])
        );

        return transposedData;
    }

    getMarkdownText(input: any) {
        if (!input) {
            return ""
        }

        return this.markdownService.parse(input);
    }
}
