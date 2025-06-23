import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildcharacterComponent } from './buildcharacter.component';

describe('BuildcharacterComponent', () => {
  let component: BuildcharacterComponent;
  let fixture: ComponentFixture<BuildcharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildcharacterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildcharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
