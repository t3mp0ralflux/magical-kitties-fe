import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterbuilderhomeComponent } from './characterbuilderhome.component';

describe('CharacterbuilderhomeComponent', () => {
  let component: CharacterbuilderhomeComponent;
  let fixture: ComponentFixture<CharacterbuilderhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterbuilderhomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterbuilderhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
