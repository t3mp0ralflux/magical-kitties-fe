import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatBubbleComponent } from './stat-bubble.component';

describe('StatBubbleComponent', () => {
  let component: StatBubbleComponent;
  let fixture: ComponentFixture<StatBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatBubbleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
