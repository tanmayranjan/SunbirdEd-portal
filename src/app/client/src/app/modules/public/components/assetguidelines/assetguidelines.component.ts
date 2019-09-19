import { Component, OnInit } from '@angular/core';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { NavigationHelperService } from '@sunbird/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assetguidelines',
  templateUrl: './assetguidelines.component.html',
  styleUrls: ['./assetguidelines.component.scss']
})
export class AssetguidelinesComponent implements OnInit {

  telemetryImpression: IImpressionEventInput;
  constructor(
    public route: Router,
    public navigationhelperService: NavigationHelperService) { }

  ngOnInit() {
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
    /*telemetry inplementation for space*/
    this.telemetryImpression = {
      context: {
        env: 'asset-guidelines'
      },
      edata: {
        type: 'view',
        pageid: 'asset-guidelines',
        uri: this.route.url,
        subtype: 'paginate',
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
    /*telemetry inplementation for space*/
  }

}
