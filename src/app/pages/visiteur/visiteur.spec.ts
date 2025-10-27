import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Visiteur } from './visiteur';

describe('Visiteur', () => {
  let component: Visiteur;
  let fixture: ComponentFixture<Visiteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Visiteur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Visiteur);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
