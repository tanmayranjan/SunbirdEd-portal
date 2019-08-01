import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { LandingPageComponent } from './components';
import { PublicPlayerService, LandingpageGuard } from './services';
import { SharedModule } from '@sunbird/shared';
import { PublicRoutingModule } from './public-routing.module';
import { DeviceDetectorService, DeviceDetectorModule } from 'ngx-device-detector';
import { CommonLicenseComponent } from './components/common-license/common-license.component';
import { PeopleInvlovedComponent } from './components/people-invloved/people-invloved.component';
import { AboutUSComponent } from './components/about-us/about-us.component';
import { BlogComponent } from './components/blog/blog.component';
import { ExploreAssetComponent } from './components/explore-asset/explore-asset.component';
import { FrameworkComponent } from './components/framework/framework.component';
import { CoreComponent } from './components/core/core.component';
import { ExploreThinkingComponent } from './components/explore-thinking/explore-thinking.component';
import { PublicFooterComponent } from './components/public-footer/public-footer.component';
import { UserSearchServicePublicService } from './services/searchService/user-search-service-public.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { OrgManagementModule } from '../org-management/';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { TelemetryModule } from '../telemetry';
import { NgInviewModule } from 'angular-inport';
import { BadgingModule } from '../badging';
import { AboutSunbirdComponent } from './components/about-sunbird/about-sunbird.component';
import { PartnersSunbirdComponent } from './components/partners-sunbird/partners-sunbird.component';
import { SuiModule } from 'ng2-semantic-ui';
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    PublicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OrgManagementModule,
    NgbCarouselModule,
    TelemetryModule,
    NgInviewModule,
    DeviceDetectorModule,
    BadgingModule,
    SuiModule,

  ],
  declarations: [LandingPageComponent,
   PublicFooterComponent, ContactUsComponent, AboutSunbirdComponent, PartnersSunbirdComponent,
   CommonLicenseComponent, PeopleInvlovedComponent, AboutUSComponent, BlogComponent,
    ExploreAssetComponent, FrameworkComponent, CoreComponent, ExploreThinkingComponent, AboutSunbirdComponent, PartnersSunbirdComponent,
    ],
  providers: [PublicPlayerService, DeviceDetectorService, LandingpageGuard, UserSearchServicePublicService]
})
export class PublicModule { }
