import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementByReservation } from './paiement-by-reservation';

describe('PaiementByReservation', () => {
  let component: PaiementByReservation;
  let fixture: ComponentFixture<PaiementByReservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementByReservation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementByReservation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
