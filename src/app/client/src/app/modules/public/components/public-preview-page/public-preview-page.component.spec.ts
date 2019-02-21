import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPreviewPageComponent } from './public-preview-page.component';

describe('PublicPreviewPageComponent', () => {
  let component: PublicPreviewPageComponent;
  let fixture: ComponentFixture<PublicPreviewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPreviewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPreviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
