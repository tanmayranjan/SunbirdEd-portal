import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceCustomMultiSelectComponent } from './space-custom-multi-select.component';

describe('SpaceCustomMultiSelectComponent', () => {
  let component: SpaceCustomMultiSelectComponent;
  let fixture: ComponentFixture<SpaceCustomMultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceCustomMultiSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceCustomMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
