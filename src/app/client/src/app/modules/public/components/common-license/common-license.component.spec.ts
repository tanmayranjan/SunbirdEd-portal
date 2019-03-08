import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonLicenseComponent } from './common-license.component';

describe('CommonLicenseComponent', () => {
  let component: CommonLicenseComponent;
  let fixture: ComponentFixture<CommonLicenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonLicenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
