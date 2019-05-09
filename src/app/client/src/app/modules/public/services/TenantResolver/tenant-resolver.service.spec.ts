import { TestBed } from '@angular/core/testing';

import { TenantResolverService } from './tenant-resolver.service';

describe('TenantResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TenantResolverService = TestBed.get(TenantResolverService);
    expect(service).toBeTruthy();
  });
});
