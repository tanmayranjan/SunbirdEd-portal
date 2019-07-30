import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceConceptPickerComponent } from './space-concept-picker.component';

describe('SpaceConceptPickerComponent', () => {
  let component: SpaceConceptPickerComponent;
  let fixture: ComponentFixture<SpaceConceptPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceConceptPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceConceptPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
