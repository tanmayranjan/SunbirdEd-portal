import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceMainHomeComponent } from './space-main-home.component';

describe('SpaceMainHomeComponent', () => {
  let component: SpaceMainHomeComponent;
  let fixture: ComponentFixture<SpaceMainHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceMainHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceMainHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
