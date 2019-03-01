import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule , ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewAllComponent, ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent } from './components';
import { SlickModule } from 'ngx-slick';
import { SuiModule } from 'ng2-semantic-ui';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OtpPopupComponent } from './components/otp-popup/otp-popup.component';

@NgModule({
  imports: [
    CommonModule,
    SlickModule,
    SharedModule,
    CoreModule,
    TelemetryModule,
    NgInviewModule,
    RouterModule,
    SuiModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ViewAllComponent, ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent, OtpPopupComponent],
  exports: [ViewAllComponent, ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent, OtpPopupComponent]
})
export class SharedFeatureModule { }
