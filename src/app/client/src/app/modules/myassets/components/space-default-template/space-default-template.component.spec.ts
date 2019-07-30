import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceDefaultTemplateComponent } from './space-default-template.component';

describe('SpaceDefaultTemplateComponent', () => {
  let component: SpaceDefaultTemplateComponent;
  let fixture: ComponentFixture<SpaceDefaultTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceDefaultTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceDefaultTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
