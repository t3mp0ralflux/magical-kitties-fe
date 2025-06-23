import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaycharacterComponent } from './displaycharacter.component';

describe('DisplaycharacterComponent', () => {
  let component: DisplaycharacterComponent;
  let fixture: ComponentFixture<DisplaycharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaycharacterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaycharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
