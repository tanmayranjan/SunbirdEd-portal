import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceDataDrivenComponent } from './space-data-driven.component';

describe('SpaceDataDrivenComponent', () => {
  let component: SpaceDataDrivenComponent;
  let fixture: ComponentFixture<SpaceDataDrivenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceDataDrivenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceDataDrivenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
