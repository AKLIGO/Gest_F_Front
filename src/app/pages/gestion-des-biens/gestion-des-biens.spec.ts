import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesBiens } from './gestion-des-biens';

describe('GestionDesBiens', () => {
  let component: GestionDesBiens;
  let fixture: ComponentFixture<GestionDesBiens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionDesBiens]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDesBiens);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
