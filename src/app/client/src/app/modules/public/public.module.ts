import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import {
  LandingPageComponent, PublicContentPlayerComponent,
  PublicCollectionPlayerComponent
} from './components';
import { SuiModule } from 'ng2-semantic-ui';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetComponent } from './components/get/get.component';
import { DialCodeComponent } from './components/dial-code/dial-code.component';
import { PublicFooterComponent } from './components/public-footer/public-footer.component';
import { PublicPlayerService, LandingpageGuard } from './services';
import { SharedModule } from '@sunbird/shared';
import { PublicRoutingModule } from './public-routing.module';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BadgingModule } from '@sunbird/badge';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { CommonLicenseComponent } from './components/common-license/common-license.component';
import { PeopleInvlovedComponent } from './components/people-invloved/people-invloved.component';
import { AboutUSComponent } from './components/about-us/about-us.component';
import { BlogComponent } from './components/blog/blog.component';
import { ExploreAssetComponent } from './components/explore-asset/explore-asset.component';
import { FrameworkComponent } from './components/framework/framework.component';
import { CoreComponent } from './components/core/core.component';
import { ExploreThinkingComponent } from './components/explore-thinking/explore-thinking.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    SuiModule,
    NgbCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    PublicRoutingModule,
    TelemetryModule,
    NgInviewModule,
    DeviceDetectorModule,
    BadgingModule,
   
  ],
  declarations: [LandingPageComponent, GetComponent, DialCodeComponent,
    PublicFooterComponent, PublicContentPlayerComponent, PublicCollectionPlayerComponent, ContactUsComponent,
    CommonLicenseComponent, PeopleInvlovedComponent, AboutUSComponent, BlogComponent,
     ExploreAssetComponent, FrameworkComponent, CoreComponent, ExploreThinkingComponent],
  providers: [PublicPlayerService, DeviceDetectorService, LandingpageGuard]
})
export class PublicModule { }
