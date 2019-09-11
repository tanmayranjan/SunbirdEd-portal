import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameworkPickerComponent } from './framework-picker.component';

describe('FrameworkPickerComponent', () => {
  let component: FrameworkPickerComponent;
  let fixture: ComponentFixture<FrameworkPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameworkPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
