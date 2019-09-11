import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceDataDrivenFilterComponent } from './space-data-driven-filter.component';

describe('SpaceDataDrivenFilterComponent', () => {
  let component: SpaceDataDrivenFilterComponent;
  let fixture: ComponentFixture<SpaceDataDrivenFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceDataDrivenFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceDataDrivenFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
