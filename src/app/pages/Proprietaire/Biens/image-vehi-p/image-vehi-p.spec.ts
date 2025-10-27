import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageVehiP } from './image-vehi-p';

describe('ImageVehiP', () => {
  let component: ImageVehiP;
  let fixture: ComponentFixture<ImageVehiP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageVehiP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageVehiP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
