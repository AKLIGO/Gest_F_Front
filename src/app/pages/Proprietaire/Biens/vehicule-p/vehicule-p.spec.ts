import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculeP } from './vehicule-p';

describe('VehiculeP', () => {
  let component: VehiculeP;
  let fixture: ComponentFixture<VehiculeP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculeP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculeP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
