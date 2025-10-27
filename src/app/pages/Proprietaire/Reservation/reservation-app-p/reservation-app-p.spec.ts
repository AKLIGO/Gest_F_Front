import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationAppP } from './reservation-app-p';

describe('ReservationAppP', () => {
  let component: ReservationAppP;
  let fixture: ComponentFixture<ReservationAppP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationAppP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationAppP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
