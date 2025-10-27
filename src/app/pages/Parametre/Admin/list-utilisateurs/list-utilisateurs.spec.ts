import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUtilisateurs } from './list-utilisateurs';

describe('ListUtilisateurs', () => {
  let component: ListUtilisateurs;
  let fixture: ComponentFixture<ListUtilisateurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUtilisateurs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUtilisateurs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
