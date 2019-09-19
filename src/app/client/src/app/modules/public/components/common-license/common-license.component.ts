import { Component, OnInit } from '@angular/core';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { NavigationHelperService } from '@sunbird/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-license',
  templateUrl: './common-license.component.html',
  styleUrls: ['./common-license.component.css']
})
export class CommonLicenseComponent implements OnInit {

  telemetryImpression: IImpressionEventInput;
  constructor(public route: Router,
    public navigationhelperService: NavigationHelperService) { }

  ngOnInit() {
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
    /*telemetry inplementation for space*/
    this.telemetryImpression = {
      context: {
        env: 'redressal-policy'
      },
      edata: {
        type: 'view',
        pageid: 'grievance-redressal-policy',
        uri: this.route.url,
        subtype: 'paginate',
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
  }
  /*telemetry inplementation for space*/
}
