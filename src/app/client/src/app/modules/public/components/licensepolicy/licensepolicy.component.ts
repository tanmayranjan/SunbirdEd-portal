import { Component, OnInit } from '@angular/core';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { NavigationHelperService } from '@sunbird/shared';
import { Router } from '@angular/router';
@Component({
  selector: 'app-licensepolicy',
  templateUrl: './licensepolicy.component.html',
  styleUrls: ['./licensepolicy.component.scss']
})
export class LicensepolicyComponent implements OnInit {

  telemetryImpression: IImpressionEventInput;

  constructor(public route: Router,
    public navigationhelperService: NavigationHelperService) { }

  ngOnInit() {
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
    /*telemetry inplementation for space*/
    this.telemetryImpression = {
      context: {
        env: 'license-policy'
      },
      edata: {
        type: 'view',
        pageid: 'license-policy',
        uri: this.route.url,
        subtype: 'paginate',
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
    /*telemetry inplementation for space*/
  }

}
