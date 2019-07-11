import { TestBed } from '@angular/core/testing';

import { SpaceEditorService } from './space-editor.service';

describe('SpaceEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpaceEditorService = TestBed.get(SpaceEditorService);
    expect(service).toBeTruthy();
  });
});
