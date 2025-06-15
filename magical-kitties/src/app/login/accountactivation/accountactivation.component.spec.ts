import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActivationComponent } from './accountactivation.component';

describe('AccountactivationComponent', () => {
    let component: AccountActivationComponent;
    let fixture: ComponentFixture<AccountActivationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccountActivationComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AccountActivationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
