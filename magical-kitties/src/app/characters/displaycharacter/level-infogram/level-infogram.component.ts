import { Component, inject } from '@angular/core';
import { CharacterAPIService } from '../../services/characters.service';

@Component({
    selector: 'app-level-infogram',
    imports: [],
    templateUrl: './level-infogram.component.html',
    styleUrl: './level-infogram.component.scss',
})
export class LevelInfogramComponent {
    characterAPIService: CharacterAPIService = inject(CharacterAPIService);
}
