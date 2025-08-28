import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterbuilderbackgroundComponent } from './characterbuilderbackground.component';

describe('CharacterbuilderbackgroundComponent', () => {
  let component: CharacterbuilderbackgroundComponent;
  let fixture: ComponentFixture<CharacterbuilderbackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterbuilderbackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterbuilderbackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
