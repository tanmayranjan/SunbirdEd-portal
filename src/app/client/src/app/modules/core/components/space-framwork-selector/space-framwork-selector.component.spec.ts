import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceFramworkSelectorComponent } from './space-framwork-selector.component';

describe('SpaceFramworkSelectorComponent', () => {
  let component: SpaceFramworkSelectorComponent;
  let fixture: ComponentFixture<SpaceFramworkSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceFramworkSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceFramworkSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
