import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KittyTreatsComponent } from './kitty-treats.component';

describe('KittyTreatsComponent', () => {
  let component: KittyTreatsComponent;
  let fixture: ComponentFixture<KittyTreatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KittyTreatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KittyTreatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
