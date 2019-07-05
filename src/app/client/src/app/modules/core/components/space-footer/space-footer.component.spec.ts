import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceFooterComponent } from './space-footer.component';

describe('SpaceFooterComponent', () => {
  let component: SpaceFooterComponent;
  let fixture: ComponentFixture<SpaceFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
