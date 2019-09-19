import { Component, OnInit } from '@angular/core';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { NavigationHelperService } from '@sunbird/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-thinking',
  templateUrl: './explore-thinking.component.html',
  styleUrls: ['./explore-thinking.component.scss']
})
export class ExploreThinkingComponent implements OnInit {

  telemetryImpression: IImpressionEventInput;

  constructor(public route: Router,
    public navigationhelperService: NavigationHelperService) { }

  ngOnInit() {
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
    /*telemetry inplementation for space*/
    this.telemetryImpression = {
      context: {
        env: 'terms of use'
      },
      edata: {
        type: 'view',
        pageid: 'terms-of-use',
        uri: this.route.url,
        subtype: 'paginate',
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
    /*telemetry inplementation for space*/
  }

}
