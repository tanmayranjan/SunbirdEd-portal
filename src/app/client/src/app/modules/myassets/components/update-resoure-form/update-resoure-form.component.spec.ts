import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateResoureFormComponent } from './update-resoure-form.component';

describe('UpdateResoureFormComponent', () => {
  let component: UpdateResoureFormComponent;
  let fixture: ComponentFixture<UpdateResoureFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateResoureFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateResoureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
