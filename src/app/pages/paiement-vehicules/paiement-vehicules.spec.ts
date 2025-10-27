import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementVehicules } from './paiement-vehicules';

describe('PaiementVehicules', () => {
  let component: PaiementVehicules;
  let fixture: ComponentFixture<PaiementVehicules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementVehicules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementVehicules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
