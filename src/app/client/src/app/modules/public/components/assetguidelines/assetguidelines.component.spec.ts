import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetguidelinesComponent } from './assetguidelines.component';

describe('AssetguidelinesComponent', () => {
  let component: AssetguidelinesComponent;
  let fixture: ComponentFixture<AssetguidelinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetguidelinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetguidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
