import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageVehicule } from './image-vehicule';

describe('ImageVehicule', () => {
  let component: ImageVehicule;
  let fixture: ComponentFixture<ImageVehicule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageVehicule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageVehicule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
