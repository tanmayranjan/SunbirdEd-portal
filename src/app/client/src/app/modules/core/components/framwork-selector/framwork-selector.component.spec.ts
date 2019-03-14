import { SharedModule } from '@sunbird/shared';
import { SearchService, ConceptPickerService, UserService, LearnerService, ContentService } from '@sunbird/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FramworkSelectorComponent } from './framwork-selector.component';

describe('FramworkSelectorComponent', () => {
  let component: FramworkSelectorComponent;
  let fixture: ComponentFixture<FramworkSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), FormsModule, HttpClientTestingModule],
      declarations: [ FramworkSelectorComponent ],
      providers: [SearchService, ConceptPickerService, UserService, LearnerService, ContentService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FramworkSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should unsubscribe from all observable subscriptions', () => {
    component.ngOnInit();
    spyOn(component.conceptDataSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.conceptDataSubscription.unsubscribe).toHaveBeenCalled();
  });
});
