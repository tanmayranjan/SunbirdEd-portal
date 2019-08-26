import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SunbirdCustomMultiSelectComponent } from './sunbird-custom-multi-select.component';

describe('SunbirdCustomMultiSelectComponent', () => {
  let component: SunbirdCustomMultiSelectComponent;
  let fixture: ComponentFixture<SunbirdCustomMultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SunbirdCustomMultiSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SunbirdCustomMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
