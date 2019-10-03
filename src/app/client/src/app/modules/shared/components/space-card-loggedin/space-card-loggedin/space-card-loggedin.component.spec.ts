import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceCardLoggedinComponent } from './space-card-loggedin.component';

describe('SpaceCardLoggedinComponent', () => {
  let component: SpaceCardLoggedinComponent;
  let fixture: ComponentFixture<SpaceCardLoggedinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceCardLoggedinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceCardLoggedinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
