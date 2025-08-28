import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterbuilderhumanComponent } from './characterbuilderhuman.component';

describe('CharacterbuilderhumanComponent', () => {
  let component: CharacterbuilderhumanComponent;
  let fixture: ComponentFixture<CharacterbuilderhumanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterbuilderhumanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterbuilderhumanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
