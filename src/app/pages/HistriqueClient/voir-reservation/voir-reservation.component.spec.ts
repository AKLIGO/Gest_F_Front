import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirReservationComponent } from './voir-reservation.component';

describe('VoirReservationComponent', () => {
  let component: VoirReservationComponent;
  let fixture: ComponentFixture<VoirReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoirReservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoirReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
