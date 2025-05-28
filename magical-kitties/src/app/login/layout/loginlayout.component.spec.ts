import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLayoutComponent } from './loginlayout.component';

describe('LayoutComponent', () => {
    let component: LoginLayoutComponent;
    let fixture: ComponentFixture<LoginLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginLayoutComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LoginLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
