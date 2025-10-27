import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementAppP } from './paiement-app-p';

describe('PaiementAppP', () => {
  let component: PaiementAppP;
  let fixture: ComponentFixture<PaiementAppP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementAppP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementAppP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
