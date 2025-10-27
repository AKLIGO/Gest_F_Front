import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationVehicule } from './reservation-vehicule';

describe('ReservationVehicule', () => {
  let component: ReservationVehicule;
  let fixture: ComponentFixture<ReservationVehicule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationVehicule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationVehicule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
