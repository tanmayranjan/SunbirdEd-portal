import { TestBed } from '@angular/core/testing';

import { SharedTenantResolverService } from './shared-tenant-resolver.service';

describe('TenantResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedTenantResolverService = TestBed.get(SharedTenantResolverService);
    expect(service).toBeTruthy();
  });
});
