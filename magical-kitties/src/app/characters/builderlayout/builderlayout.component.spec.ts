import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderlayoutComponent } from './builderlayout.component';

describe('BuilderlayoutComponent', () => {
  let component: BuilderlayoutComponent;
  let fixture: ComponentFixture<BuilderlayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderlayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
