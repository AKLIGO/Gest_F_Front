import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilByUtilisateur } from './profil-by-utilisateur';

describe('ProfilByUtilisateur', () => {
  let component: ProfilByUtilisateur;
  let fixture: ComponentFixture<ProfilByUtilisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilByUtilisateur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilByUtilisateur);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
