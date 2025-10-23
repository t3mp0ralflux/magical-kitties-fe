import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemBuilderComponent } from './problem-builder.component';

describe('ProblemBuilderComponent', () => {
  let component: ProblemBuilderComponent;
  let fixture: ComponentFixture<ProblemBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProblemBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
