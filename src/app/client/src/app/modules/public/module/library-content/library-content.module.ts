import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryContentRoutingModule } from './library-content-routing.module';
import { ExploreLibraryComponent } from './components/explore-library/explore-library.component';
import {LibraryComponent } from './components/library/library.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgInviewModule } from 'angular-inport';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
  SuiRatingModule, SuiCollapseModule } from 'ng2-semantic-ui';
@NgModule({
  declarations: [LibraryComponent, ExploreLibraryComponent],
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    NgInviewModule,
    LibraryContentRoutingModule,
    SharedFeatureModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule
  ],
})
export class LibraryContentModule { }
