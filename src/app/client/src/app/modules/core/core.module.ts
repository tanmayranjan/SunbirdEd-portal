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
   OrgDetailsService, ChannelService } from './services';
import { ConceptPickerService } from './services/concept-picker/concept-picker.service';
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
    AvatarModule
  ],
  declarations: [MainHeaderComponent, MainFooterComponent, MainMenuComponent, SearchComponent, PermissionDirective,
    BodyScrollDirective, DataDrivenFilterComponent, SortByComponent, SunbirdFooterComponent, SunbirdHeaderComponent,
    ErrorPageComponent, FlagContentComponent, LanguageDropdownComponent, SunbirdFooterComponent, SunbirdHeaderComponent,
    ProminentFilterComponent, TopicPickerComponent, StickyHeaderDirective,
    SunbirdDataDrivenFilterComponent, SpaceHeaderComponent, SpaceFooterComponent,
     SpaceProminentFilterComponent, FrameworkPickerComponent, FramworkSelectorComponent],
  exports: [MainHeaderComponent, MainFooterComponent, PermissionDirective, BodyScrollDirective, SunbirdDataDrivenFilterComponent,
    DataDrivenFilterComponent, SortByComponent, FlagContentComponent, SunbirdFooterComponent,
     SunbirdHeaderComponent, SpaceHeaderComponent,
    SpaceFooterComponent, SpaceProminentFilterComponent,
    TelemetryModule, LanguageDropdownComponent, ProminentFilterComponent, TopicPickerComponent],
  providers: [CacheService, AuthGuard]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [LearnerService, TenantService, SearchService, CopyContentService,
        AnnouncementService, BadgesService, ContentService, CoursesService, PageApiService,
        AuthGuard, FrameworkService, FormService, CacheService,
        ConceptPickerService, PlayerService, OrgDetailsService,
        ChannelService]
    };
  }
}

