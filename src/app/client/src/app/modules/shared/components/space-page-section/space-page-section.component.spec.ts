import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacePageSectionComponent } from './space-page-section.component';

describe('SpacePageSectionComponent', () => {
  let component: SpacePageSectionComponent;
  let fixture: ComponentFixture<SpacePageSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpacePageSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpacePageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
