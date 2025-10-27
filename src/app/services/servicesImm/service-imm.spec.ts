import { TestBed } from '@angular/core/testing';

import { ServiceImm } from './service-imm';

describe('ServiceImm', () => {
  let service: ServiceImm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceImm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
