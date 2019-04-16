import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledCardComponent } from './enrolled-card.component';

describe('EnrolledCardComponent', () => {
  let component: EnrolledCardComponent;
  let fixture: ComponentFixture<EnrolledCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrolledCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolledCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
