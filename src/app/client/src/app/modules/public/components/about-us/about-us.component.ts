import { Component, OnInit } from '@angular/core';
import { NavigationHelperService } from '@sunbird/shared';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { Router } from '@angular/router'
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUSComponent implements OnInit {

  telemetryImpression: IImpressionEventInput;

  constructor(public route: Router, public navigationhelperService: NavigationHelperService) { }

  ngOnInit() {
    /*telemetry implementation for space*/
    this.telemetryImpression = {
      context: {
        env: "about"
      },
      edata: {
        type: "view",
        pageid: "about",
        uri: this.route.url,
        subtype: "paginate",
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
    /*telemetry implementation for space*/
  }

}
