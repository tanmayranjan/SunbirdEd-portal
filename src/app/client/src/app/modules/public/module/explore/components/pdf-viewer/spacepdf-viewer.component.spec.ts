import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacepdfViewerComponent } from './spacepdf-viewer.component';

describe('PdfViewerComponent', () => {
  let component: SpacepdfViewerComponent;
  let fixture: ComponentFixture<SpacepdfViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpacepdfViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpacepdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
