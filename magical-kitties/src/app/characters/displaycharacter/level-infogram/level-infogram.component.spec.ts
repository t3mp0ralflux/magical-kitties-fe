import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelInfogramComponent } from './level-infogram.component';

describe('LevelInfogramComponent', () => {
  let component: LevelInfogramComponent;
  let fixture: ComponentFixture<LevelInfogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelInfogramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelInfogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
