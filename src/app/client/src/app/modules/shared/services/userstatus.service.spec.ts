import { TestBed } from '@angular/core/testing';

import { UserstatusService } from './userstatus.service';

describe('UserstatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserstatusService = TestBed.get(UserstatusService);
    expect(service).toBeTruthy();
  });
});
