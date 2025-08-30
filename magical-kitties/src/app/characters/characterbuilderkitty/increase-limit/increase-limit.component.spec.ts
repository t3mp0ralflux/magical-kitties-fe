import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncreaseLimitComponent } from './increase-limit.component';

describe('IncreaseLimitComponent', () => {
  let component: IncreaseLimitComponent;
  let fixture: ComponentFixture<IncreaseLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncreaseLimitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncreaseLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
