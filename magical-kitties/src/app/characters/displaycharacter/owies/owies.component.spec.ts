import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwiesComponent } from './owies.component';

describe('OwiesComponent', () => {
  let component: OwiesComponent;
  let fixture: ComponentFixture<OwiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
