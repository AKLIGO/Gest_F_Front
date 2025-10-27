import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmeubleP } from './immeuble-p';

describe('ImmeubleP', () => {
  let component: ImmeubleP;
  let fixture: ComponentFixture<ImmeubleP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmeubleP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmeubleP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
