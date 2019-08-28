import { PermissionDirective, BodyScrollDirective, StickyHeaderDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule, SearchService
} from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import { AvatarModule } from 'ngx-avatar';
import {
  MainHeaderComponent, MainFooterComponent, MainMenuComponent, SearchComponent,
  DataDrivenFilterComponent, ErrorPageComponent, SortByComponent, FlagContentComponent,
  LanguageDropdownComponent, ProminentFilterComponent, TopicPickerComponent
} from './components';
import { AuthGuard } from './guard/auth-gard.service';
import { CacheService } from 'ng2-cache-service';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { TelemetryModule } from '@sunbird/telemetry';
import { SunbirdFooterComponent } from './components/sunbird-footer/sunbird-footer.component';
import { SunbirdHeaderComponent } from './components/sunbird-header/sunbird-header.component';
import { SunbirdDataDrivenFilterComponent } from './components/sunbird-data-driven-filter/sunbird-data-driven-filter.component';
import { SpaceHeaderComponent } from './components/space-header/space-header.component';
import { SpaceFooterComponent } from './components/space-footer/space-footer.component';
import { SpaceProminentFilterComponent } from './components/space-prominent-filter/space-prominent-filter.component';
import { FrameworkPickerComponent } from './components/framework-picker/framework-picker.component';
import { FramworkSelectorComponent } from './components/framwork-selector/framwork-selector.component';
import { LearnerService, TenantService, CopyContentService, AnnouncementService, BadgesService,
   ContentService, CoursesService, PageApiService, FormService, FrameworkService, PlayerService,
   OrgDetailsService, ChannelService, UploadContentService, AssetService } from './services';
import { ConceptPickerService } from './services/concept-picker/concept-picker.service';
import { SpaceDataDrivenFilterComponent } from './components/space-data-driven-filter/space-data-driven-filter.component';
import { OtherSearchComponent } from './components/other-search/other-search.component';
import { SpaceMainMenuComponent } from './components/space-main-menu/space-main-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { ConceptPickerComponent } from './components/concept-picker/concept-picker.component';
import { SpaceConceptPickerComponent } from './components/space-concept-picker/space-concept-picker.component';
import { SpaceFramworkSelectorComponent } from './components/space-framwork-selector/space-framwork-selector.component';
import { SunbirdProminentFilterComponent } from './components/sunbird-prominent-filter/sunbird-prominent-filter.component';
@NgModule({
  imports: [
    CommonModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    WebExtensionModule,
    TelemetryModule,
    AvatarModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  declarations: [MainHeaderComponent, MainFooterComponent, MainMenuComponent, SearchComponent, PermissionDirective,
    BodyScrollDirective, DataDrivenFilterComponent, SortByComponent, SunbirdFooterComponent, SunbirdHeaderComponent,
    ErrorPageComponent, FlagContentComponent, LanguageDropdownComponent, SunbirdFooterComponent, SunbirdHeaderComponent,
    ProminentFilterComponent, TopicPickerComponent, StickyHeaderDirective, OtherSearchComponent,
    SunbirdDataDrivenFilterComponent, SpaceHeaderComponent, SpaceFooterComponent, ConceptPickerComponent,
     SpaceProminentFilterComponent, FrameworkPickerComponent, FramworkSelectorComponent, SpaceDataDrivenFilterComponent,
      OtherSearchComponent, SpaceMainMenuComponent, SpaceConceptPickerComponent, SpaceFramworkSelectorComponent,
      SunbirdProminentFilterComponent],
  exports: [MainHeaderComponent, MainFooterComponent, PermissionDirective, BodyScrollDirective,
    SunbirdDataDrivenFilterComponent, SunbirdProminentFilterComponent,
    DataDrivenFilterComponent, SortByComponent, FlagContentComponent, SunbirdFooterComponent,
     FrameworkPickerComponent, FramworkSelectorComponent,
     SunbirdHeaderComponent, SpaceHeaderComponent, SpaceDataDrivenFilterComponent,
      FramworkSelectorComponent, SpaceConceptPickerComponent, SpaceFramworkSelectorComponent,
    SpaceFooterComponent, SpaceProminentFilterComponent, SearchComponent, ConceptPickerComponent,
    TelemetryModule, LanguageDropdownComponent, ProminentFilterComponent, TopicPickerComponent],
  providers: [CacheService, AuthGuard]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [LearnerService, TenantService, SearchService, CopyContentService,
        AnnouncementService, BadgesService, ContentService, CoursesService, PageApiService,
        AuthGuard, FrameworkService, FormService, CacheService, AssetService,
        ConceptPickerService, PlayerService, OrgDetailsService, UploadContentService ,
        ChannelService]
    };
  }
}

