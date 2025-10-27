import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationVehiP } from './reservation-vehi-p';

describe('ReservationVehiP', () => {
  let component: ReservationVehiP;
  let fixture: ComponentFixture<ReservationVehiP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationVehiP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationVehiP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
