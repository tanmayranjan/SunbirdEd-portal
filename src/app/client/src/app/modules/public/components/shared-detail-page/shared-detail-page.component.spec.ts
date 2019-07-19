import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDetailPageComponent } from './shared-detail-page.component';

describe('SharedDetailPageComponent', () => {
  let component: SharedDetailPageComponent;
  let fixture: ComponentFixture<SharedDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
