import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import { Subscription } from 'rxjs';
import { LevelInfogramComponent } from "../../characters/displaycharacter/level-infogram/level-infogram.component";
import { CharacterAPIService } from '../../characters/services/characters.service';
import { InfoBoxComponent } from "./info-box/info-box.component";
import { SkillTableComponent } from "./skill-table/skill-table.component";
import { TipBoxComponent } from "./tip-box/tip-box.component";

@Component({
    selector: 'app-rules',
    imports: [CommonModule, MatIconModule, MatTabsModule, MatTableModule, MarkdownComponent, InfoBoxComponent, TipBoxComponent, SkillTableComponent, LevelInfogramComponent],
    templateUrl: './rules.component.html',
    styleUrl: './rules.component.scss',
})
export class RulesComponent {
    characterAPI: CharacterAPIService = inject(CharacterAPIService);
    markdownService: MarkdownService = inject(MarkdownService);
    route: ActivatedRoute = inject(ActivatedRoute);
    skillColumns: string[] = ["id", "name"];
    difficultyColumns: string[] = ["difficulty", "cute", "cunning", "fierce"];
    diceColumns: string[] = ["successes", "result", "enhancements"];
    readonly ROWS_PER_COL = 12;
    routeSubscription: Subscription = new Subscription();
    shownTab = 0;
    kittyRules: string[] = ["You must keep your magic hidden from humans.", "You pick your human, even when it seems like the humans pick the kitties.", "You want to help your human.", "You can understand humans, but they can't understand you.", "You can understand other animals, and they can understand you, too.", "You can read human writing, but it's very difficult and sometimes you get it wrong.", "You have a special spot in your home that the humans can't reach. This spot lets you get in and out of your home without being seen.", "YOU MUST KEEP YOUR MAGIC HIDDEN FROM HUMANS!<br />(There are a small number of humans who already know the secrets of magical kitties. Witches, for example. These humans can often understand you, and it's okay to use your Magical Powers in front of them.)"];
    sceneTip: string = "If you're using the game's cards, it's easy to track whether you've used your Magical Power each scene. Just take that card for yourself and flip it over when you've used it!";
    injuryTip: string = "Dice pools are reduced by your Injuries. And if you take three Injuries (four max), you're knocked out. But those are two separate things. You could actually have dice in your pool (from bonuses), but be unable to roll because you're knocked out!";
    experienceTip: string = "There's no limit to how many Experience Points per episode a player can get from failed rolls. As an option, the GM can add a limit of 2 or 3 points if players are abusing this";

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
                    case "treats":
                        this.shownTab = 5;
                        break;
                    case "problems":
                        this.shownTab = 6;
                        break;
                    default:
                        this.shownTab = 0;
                        break;
                }
            }
        });
    }

    concatArray(baseArray: any[], ...items: any[]) {
        return [...baseArray, ...items];
    }

    getEndOfEpisodeInformation(): string[] {
        let result: string[] = [];

        if (this.characterAPI.rules?.endEpisodeQuestions) {
            result = [...this.characterAPI.rules.endEpisodeQuestions];

            result[result.length - 1] = `${result[result.length - 1]} <br /> <br /> ${this.characterAPI.rules.endOfEpisodeInfo}`;
        }

        return result;
    }

    getTierUpgrades(block: number): any[] {
        let result: any[] = [];

        if (this.characterAPI.rules) {
            result = this.characterAPI.rules?.upgrades.filter(x => x.block === block).map(item => { return item.value });
        }

        return result;
    }
}
