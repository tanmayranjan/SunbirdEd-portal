import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyassestPageComponent } from './myassest-page.component';

describe('MyassestPageComponent', () => {
  let component: MyassestPageComponent;
  let fixture: ComponentFixture<MyassestPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyassestPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyassestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
