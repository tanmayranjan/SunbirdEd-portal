import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSingleUserComponent } from './add-single-user.component';

describe('AddSingleUserComponent', () => {
  let component: AddSingleUserComponent;
  let fixture: ComponentFixture<AddSingleUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSingleUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSingleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
