import { TestBed } from '@angular/core/testing';

import { ServiceImage } from './service-image';

describe('ServiceImage', () => {
  let service: ServiceImage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceImage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
