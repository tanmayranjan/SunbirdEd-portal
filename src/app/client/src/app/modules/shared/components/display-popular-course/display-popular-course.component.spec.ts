import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPopularCourseComponent } from './display-popular-course.component';

describe('DisplayPopularCourseComponent', () => {
  let component: DisplayPopularCourseComponent;
  let fixture: ComponentFixture<DisplayPopularCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayPopularCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPopularCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
