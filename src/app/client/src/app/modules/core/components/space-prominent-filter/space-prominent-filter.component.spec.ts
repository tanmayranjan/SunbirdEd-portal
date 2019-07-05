import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceProminentFilterComponent } from './space-prominent-filter.component';

describe('SpaceProminentFilterComponent', () => {
  let component: SpaceProminentFilterComponent;
  let fixture: ComponentFixture<SpaceProminentFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceProminentFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceProminentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
