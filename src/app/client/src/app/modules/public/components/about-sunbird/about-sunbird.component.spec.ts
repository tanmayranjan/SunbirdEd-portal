import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSunbirdComponent } from './about-sunbird.component';

describe('AboutSunbirdComponent', () => {
  let component: AboutSunbirdComponent;
  let fixture: ComponentFixture<AboutSunbirdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutSunbirdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSunbirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
