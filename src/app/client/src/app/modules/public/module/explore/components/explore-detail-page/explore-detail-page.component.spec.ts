import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreDetailPageComponent } from './explore-detail-page.component';

describe('ExploreDetailPageComponent', () => {
  let component: ExploreDetailPageComponent;
  let fixture: ComponentFixture<ExploreDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
