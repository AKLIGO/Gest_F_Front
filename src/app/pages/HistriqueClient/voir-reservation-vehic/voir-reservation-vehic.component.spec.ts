import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirReservationVehicComponent } from './voir-reservation-vehic.component';

describe('VoirReservationVehicComponent', () => {
  let component: VoirReservationVehicComponent;
  let fixture: ComponentFixture<VoirReservationVehicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoirReservationVehicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoirReservationVehicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
