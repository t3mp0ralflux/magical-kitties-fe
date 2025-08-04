import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusFeatureComponent } from './bonus-feature.component';

describe('BonusFeatureComponent', () => {
  let component: BonusFeatureComponent;
  let fixture: ComponentFixture<BonusFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusFeatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
