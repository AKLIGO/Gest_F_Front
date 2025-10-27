import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionsRoleUtilisateur } from './gestions-role-utilisateur';

describe('GestionsRoleUtilisateur', () => {
  let component: GestionsRoleUtilisateur;
  let fixture: ComponentFixture<GestionsRoleUtilisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionsRoleUtilisateur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionsRoleUtilisateur);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
