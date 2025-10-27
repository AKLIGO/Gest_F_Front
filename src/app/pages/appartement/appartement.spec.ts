import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Appartement } from './appartement';

describe('Appartement', () => {
  let component: Appartement;
  let fixture: ComponentFixture<Appartement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Appartement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Appartement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
