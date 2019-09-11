import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FramworkSelectorComponent } from './framwork-selector.component';

describe('FramworkSelectorComponent', () => {
  let component: FramworkSelectorComponent;
  let fixture: ComponentFixture<FramworkSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FramworkSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FramworkSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
