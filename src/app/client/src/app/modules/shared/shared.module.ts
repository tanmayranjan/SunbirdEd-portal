import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { FormsModule } from '@angular/forms';
import {
  AnnouncementInboxCardComponent, PageSectionComponent, NoResultComponent, AppLoaderComponent, CardComponent,
  CardCreationComponent, ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, RedirectComponent,
  CustomMultiSelectComponent, InstallAppComponent, LockInfoPopupComponent, BatchCardComponent,
  OfflineCardComponent, OfflineBannerComponent, OfflineApplicationDownloadComponent, FullPageModalComponent
} from './components';
import {
  ConfigService, ResourceService, ToasterService, WindowScrollService, BrowserCacheTtlService,
  PaginationService, RouterNavigationService, NavigationHelperService, UtilService, ContentUtilsServiceService, ExternalUrlPreviewService
} from './services';
import { ContentDirectionDirective } from './directives';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DateFormatPipe, DateFilterXtimeAgoPipe, FilterPipe, InterpolatePipe } from './pipes';
import { CacheService } from 'ng2-cache-service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TelemetryModule } from '@sunbird/telemetry';
import { CdnprefixPipe } from './pipes/cdnprefix.pipe';
import { AssetCardComponent } from './components/asset-card/asset-card.component';
import { SpaceCustomMultiSelectComponent } from './components/space-custom-multi-select/space-custom-multi-select.component';
import { SpaceCardComponent } from './components/space-card/space-card.component';
import { SpacePageSectionComponent } from './components/space-page-section/space-page-section.component';
import { HighlightTextDirective } from './directives/highlight-text/highlight-text.directive';
import { SunbirdCustomMultiSelectComponent } from './components/sunbird-custom-multi-select/sunbird-custom-multi-select.component';
import { SpaceCardLoggedinComponent } from './components/space-card-loggedin/space-card-loggedin/space-card-loggedin.component';


@NgModule({
  imports: [
    CommonModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,
    SlickModule,
    FormsModule,
    TelemetryModule
  ],
  declarations: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe, PageSectionComponent, AssetCardComponent,
    BatchCardComponent, NoResultComponent, DateFilterXtimeAgoPipe, CardComponent, CardCreationComponent, FilterPipe, InterpolatePipe,
    ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe, RedirectComponent, CustomMultiSelectComponent,
    InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective, OfflineCardComponent, OfflineBannerComponent,
    OfflineApplicationDownloadComponent, HighlightTextDirective, FullPageModalComponent, SpaceCustomMultiSelectComponent,
    SpaceCardComponent, SpacePageSectionComponent, SunbirdCustomMultiSelectComponent, SpaceCardLoggedinComponent],
  exports: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe, DateFilterXtimeAgoPipe, AssetCardComponent,
    PageSectionComponent, BatchCardComponent, NoResultComponent,
     CardComponent, OfflineCardComponent, CardCreationComponent,
     FilterPipe, SpaceCardComponent, SunbirdCustomMultiSelectComponent,
    ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe, InterpolatePipe, RedirectComponent,
    CustomMultiSelectComponent, InstallAppComponent, LockInfoPopupComponent,
    ContentDirectionDirective, OfflineBannerComponent,
    OfflineApplicationDownloadComponent, HighlightTextDirective,
     FullPageModalComponent, SpacePageSectionComponent, SpaceCustomMultiSelectComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ResourceService, ConfigService, ToasterService, PaginationService,
        RouterNavigationService, WindowScrollService, NavigationHelperService, CacheService, UtilService, ContentUtilsServiceService,
        DeviceDetectorModule, DeviceDetectorService, BrowserCacheTtlService, ExternalUrlPreviewService]
    };
  }
}
