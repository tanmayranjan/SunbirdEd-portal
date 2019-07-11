import { TestBed } from '@angular/core/testing';

import { MyassetsService } from './myassets.service';

describe('MyassetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyassetsService = TestBed.get(MyassetsService);
    expect(service).toBeTruthy();
  });
});
