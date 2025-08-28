import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeIncreaseComponent } from './attribute-increase.component';

describe('AttributeIncreaseComponent', () => {
  let component: AttributeIncreaseComponent;
  let fixture: ComponentFixture<AttributeIncreaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeIncreaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeIncreaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
