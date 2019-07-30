import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreThinkingComponent } from './explore-thinking.component';

describe('ExploreThinkingComponent', () => {
  let component: ExploreThinkingComponent;
  let fixture: ComponentFixture<ExploreThinkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreThinkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreThinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
