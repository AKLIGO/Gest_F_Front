import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppartementP } from './appartement-p';

describe('AppartementP', () => {
  let component: AppartementP;
  let fixture: ComponentFixture<AppartementP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppartementP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppartementP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
