import { TestBed, inject } from '@angular/core/testing';

import { UserSearchServicePublicService } from './user-search-service-public.service';

describe('UserSearchServicePublicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserSearchServicePublicService]
    });
  });

  it('should be created', inject([UserSearchServicePublicService], (service: UserSearchServicePublicService) => {
    expect(service).toBeTruthy();
  }));
});
