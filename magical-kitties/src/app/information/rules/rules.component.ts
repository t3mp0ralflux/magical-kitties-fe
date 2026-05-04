import { Component, inject } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import { Subscription } from 'rxjs';
import { CharacterAPIService } from '../../characters/services/characters.service';

@Component({
    selector: 'app-rules',
    imports: [MatIconModule, MatTabsModule, MatTableModule, MarkdownComponent],
    templateUrl: './rules.component.html',
    styleUrl: './rules.component.scss',
})
export class RulesComponent {
    characterAPI: CharacterAPIService = inject(CharacterAPIService);
    markdownService: MarkdownService = inject(MarkdownService);
    route: ActivatedRoute = inject(ActivatedRoute);
    displayedColumns: string[] = ["id", "name"];
    displayedDifficultyColumns: string[] = ["difficulty", "cute", "cunning", "fierce"]
    readonly ROWS_PER_COL = 12;
    displayedColumns2: string[] = [];
    routeSubscription: Subscription = new Subscription();
    shownTab = 0;

    ngOnInit(): void {
        if (!this.characterAPI.rules) {
            this.characterAPI.getRules().subscribe();
        }

        this.routeSubscription = this.route.fragment.subscribe({
            next: (fragment) => {
                switch (fragment?.toLowerCase()) {
                    case "talents":
                        this.shownTab = 1;
                        break;
                    case "flaws":
                        this.shownTab = 2;
                        break;
                    case "magic":
                        this.shownTab = 3;
                        break;
                    case "checks":
                        this.shownTab = 4;
                        break;
                    default:
                        this.shownTab = 0;
                        break;
                }
            }
        })

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
