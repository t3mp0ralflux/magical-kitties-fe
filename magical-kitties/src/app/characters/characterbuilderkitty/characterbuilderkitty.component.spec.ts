import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterbuilderkittyComponent } from './characterbuilderkitty.component';

describe('CharacterbuilderkittyComponent', () => {
  let component: CharacterbuilderkittyComponent;
  let fixture: ComponentFixture<CharacterbuilderkittyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterbuilderkittyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterbuilderkittyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
