import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSearchFilterComponent } from './course-search-filter.component';

describe('CourseSearchFilterComponent', () => {
  let component: CourseSearchFilterComponent;
  let fixture: ComponentFixture<CourseSearchFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseSearchFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
