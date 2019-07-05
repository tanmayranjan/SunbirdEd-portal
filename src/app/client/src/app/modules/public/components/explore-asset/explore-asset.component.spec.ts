import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreAssetComponent } from './explore-asset.component';

describe('ExploreAssetComponent', () => {
  let component: ExploreAssetComponent;
  let fixture: ComponentFixture<ExploreAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
