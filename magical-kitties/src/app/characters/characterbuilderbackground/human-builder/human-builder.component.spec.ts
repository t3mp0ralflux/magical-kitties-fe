import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanBuilderComponent } from './human-builder.component';

describe('HumanBuilderComponent', () => {
  let component: HumanBuilderComponent;
  let fixture: ComponentFixture<HumanBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
