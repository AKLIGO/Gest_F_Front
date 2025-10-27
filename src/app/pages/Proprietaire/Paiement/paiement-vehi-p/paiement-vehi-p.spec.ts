import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementVehiP } from './paiement-vehi-p';

describe('PaiementVehiP', () => {
  let component: PaiementVehiP;
  let fixture: ComponentFixture<PaiementVehiP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementVehiP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementVehiP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
