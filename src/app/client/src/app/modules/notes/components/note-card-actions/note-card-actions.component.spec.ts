import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCardActionsComponent } from './note-card-actions.component';

describe('NoteCardActionsComponent', () => {
  let component: NoteCardActionsComponent;
  let fixture: ComponentFixture<NoteCardActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteCardActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteCardActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
