import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensepolicyComponent } from './licensepolicy.component';

describe('LicensepolicyComponent', () => {
  let component: LicensepolicyComponent;
  let fixture: ComponentFixture<LicensepolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensepolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensepolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
