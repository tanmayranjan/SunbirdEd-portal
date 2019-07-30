import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceResourceSearchComponent } from './space-resource-search.component';

describe('SpaceResourceSearchComponent', () => {
  let component: SpaceResourceSearchComponent;
  let fixture: ComponentFixture<SpaceResourceSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceResourceSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceResourceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
