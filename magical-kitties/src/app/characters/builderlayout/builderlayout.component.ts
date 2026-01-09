import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterEvent, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { BehaviorSubject, filter, forkJoin, Observable } from 'rxjs';
import { Constants } from '../../Constants';
import { FooterComponent } from '../../layout/footer/footer.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { LayoutComponent } from '../../layout/layout.component';
import { Character } from '../../models/Characters/character.model';
import { UpdateCharacterDescriptors } from '../../models/Characters/updatecharacterdescriptors.model';
import { trackByFn } from '../../utilities';
import { CharacterAPIService } from '../services/characters.service';

@Component({
    selector: 'app-builderlayout',
    imports: [CommonModule, RouterOutlet, MatToolbarModule, MatIconModule, HeaderComponent, FooterComponent, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatDividerModule, RouterLinkWithHref],
    templateUrl: './builderlayout.component.html',
    styleUrl: './builderlayout.component.scss'
})
export class BuilderlayoutComponent extends LayoutComponent implements OnDestroy {
    router: Router = inject(Router);
    characterApi: CharacterAPIService = inject(CharacterAPIService);
    Constants = Constants;
    trackByFn = trackByFn;
    characterId: string;
    currentPage?: string;
    character?: Character;
    nameMaxCountSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    remainingNameCharacters$: Observable<number> = this.nameMaxCountSubject.asObservable();

    constructor() {
        super();
        this.characterId = this.route.snapshot.params["id"];

        const apiSubscription = forkJoin({
            character: this.characterApi.getCharacterInformation(this.characterId),
            rules: this.characterApi.getRules()
        }).subscribe({
            next: (_) => {
                this.updateMaxName();
            }
        });

        const routerSubscription = this.router.events
            .pipe(
                filter((e) => e instanceof RouterEvent)
            )
            .subscribe({
                next: (event) => {
                    this.currentPage = event.url.split('/').at(-1);
                }
            });

        const characterSubscription = this.characterApi.character$.subscribe({
            next: (character: Character | undefined) => {
                this.character = character;
            }
        });

        this.subscriptions.push(...[apiSubscription, routerSubscription, characterSubscription]);
    }

    updateMaxName(): void {
        if (!this.character) {
            return;
        }

        let maxCharacters = Constants.MaxCharactersMediumInput;
        if (this.character.name) {
            maxCharacters = maxCharacters - this.character.name.length;
        }

        this.nameMaxCountSubject.next(maxCharacters);
    }

    updateName(): void {
        const payload: UpdateCharacterDescriptors = {
            characterId: this.character!.id,
            name: this.character?.name,
        };

        this.characterApi.updateName(payload).subscribe({
            next: (_) => {
            },
            error: (err) => {
                console.log("Name update error: " + err);
            }
        })
    }

    navigate(page: string) {
        this.router.navigate([page], { relativeTo: this.route });
    }
}
