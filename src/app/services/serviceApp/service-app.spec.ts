import { TestBed } from '@angular/core/testing';

import { ServiceApp } from './service-app';

describe('ServiceApp', () => {
  let service: ServiceApp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceApp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
