import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceMainMenuComponent } from './space-main-menu.component';

describe('SpaceMainMenuComponent', () => {
  let component: SpaceMainMenuComponent;
  let fixture: ComponentFixture<SpaceMainMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceMainMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
