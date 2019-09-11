import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpacehomeRoutingModule } from './spacehome-routing.module';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';

import { HomeAnnouncementService } from './service/index';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { AnnouncementModule } from '@sunbird/announcement';
import { SpaceMainHomeComponent } from './component/space-main-home/space-main-home.component';

@NgModule({
  imports: [
    SuiModule,
    CommonModule,
    SpacehomeRoutingModule,
    SlickModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    NgInviewModule,
    TelemetryModule,
    AnnouncementModule
  ],
  declarations: [
    SpaceMainHomeComponent,
  ],
  providers: [HomeAnnouncementService]
})
export class SpacehomeModule {
}
