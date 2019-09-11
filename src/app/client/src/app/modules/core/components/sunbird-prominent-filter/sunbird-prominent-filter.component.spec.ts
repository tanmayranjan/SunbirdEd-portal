import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SunbirdProminentFilterComponent } from './sunbird-prominent-filter.component';

describe('SunbirdProminentFilterComponent', () => {
  let component: SunbirdProminentFilterComponent;
  let fixture: ComponentFixture<SunbirdProminentFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SunbirdProminentFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SunbirdProminentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
