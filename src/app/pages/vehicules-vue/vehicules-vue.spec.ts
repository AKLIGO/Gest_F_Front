import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculesVue } from './vehicules-vue';

describe('VehiculesVue', () => {
  let component: VehiculesVue;
  let fixture: ComponentFixture<VehiculesVue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculesVue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculesVue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
