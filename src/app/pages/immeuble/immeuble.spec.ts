import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Immeuble } from './immeuble';

describe('Immeuble', () => {
  let component: Immeuble;
  let fixture: ComponentFixture<Immeuble>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Immeuble]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Immeuble);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
