import { TestBed, inject } from '@angular/core/testing';

import { ConfigureService } from './configure.service';

describe('ConfigureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigureService]
    });
  });

  it('should be created', inject([ConfigureService], (service: ConfigureService) => {
    expect(service).toBeTruthy();
  }));
});
