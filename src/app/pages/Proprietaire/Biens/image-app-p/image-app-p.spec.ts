import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAppP } from './image-app-p';

describe('ImageAppP', () => {
  let component: ImageAppP;
  let fixture: ComponentFixture<ImageAppP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageAppP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageAppP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
