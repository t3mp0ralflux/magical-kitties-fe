import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagicalPowerComponent } from './magical-power.component';

describe('MagicalPowerComponent', () => {
  let component: MagicalPowerComponent;
  let fixture: ComponentFixture<MagicalPowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagicalPowerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagicalPowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
