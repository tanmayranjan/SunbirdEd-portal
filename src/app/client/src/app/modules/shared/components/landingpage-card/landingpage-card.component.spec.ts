import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpageCardComponent } from './landingpage-card.component';

describe('LandingpageCardComponent', () => {
  let component: LandingpageCardComponent;
  let fixture: ComponentFixture<LandingpageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingpageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingpageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
