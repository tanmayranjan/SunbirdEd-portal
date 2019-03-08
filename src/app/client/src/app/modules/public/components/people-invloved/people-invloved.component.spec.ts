import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleInvlovedComponent } from './people-invloved.component';

describe('PeopleInvlovedComponent', () => {
  let component: PeopleInvlovedComponent;
  let fixture: ComponentFixture<PeopleInvlovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleInvlovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleInvlovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
