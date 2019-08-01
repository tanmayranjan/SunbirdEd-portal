import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersSunbirdComponent } from './partners-sunbird.component';

describe('PartnersSunbirdComponent', () => {
  let component: PartnersSunbirdComponent;
  let fixture: ComponentFixture<PartnersSunbirdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnersSunbirdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersSunbirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
