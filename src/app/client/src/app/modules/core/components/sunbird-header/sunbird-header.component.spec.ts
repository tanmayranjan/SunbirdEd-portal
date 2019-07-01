import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SunbirdHeaderComponent } from './sunbird-header.component';

describe('SunbirdHeaderComponent', () => {
  let component: SunbirdHeaderComponent;
  let fixture: ComponentFixture<SunbirdHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SunbirdHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SunbirdHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
