import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipBoxComponent } from './tip-box.component';

describe('TipBoxComponent', () => {
  let component: TipBoxComponent;
  let fixture: ComponentFixture<TipBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
