import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'stat-block',
    imports: [CommonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
    templateUrl: './stat-block.component.html',
    styleUrl: './stat-block.component.scss'
})
export class StatBlockComponent implements OnInit {
    @Input() statName!: string;
    @Input() availableValues: number[] = [];
    @Input() statValue: number = 0;
    @Output() valueChanged: BehaviorSubject<any> = new BehaviorSubject<any>({ previous: 0, next: 0 });
    private previousValue: number = 0;

    control: FormControl = new FormControl();

    constructor() {
    }

    ngOnInit(): void {
        this.control.setValue(this.statValue);
        this.previousValue = this.statValue ?? 0;
    }

    updateAvailableNumbers(event: MatSelectChange) {
        this.valueChanged.next({ previous: this.previousValue, next: event.value });
    }
}
