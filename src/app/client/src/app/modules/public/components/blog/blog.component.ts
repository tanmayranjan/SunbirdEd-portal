import { Component, OnInit } from '@angular/core';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { NavigationHelperService } from '@sunbird/shared';
import { Router } from '@angular/router';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  telemetryImpression: IImpressionEventInput;

  constructor(public route: Router,
    public navigationhelperService: NavigationHelperService) { }

  ngOnInit() {
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
    /*telemetry inplementation for space*/
    this.telemetryImpression = {
      context: {
        env: 'data and privacy'
      },
      edata: {
        type: 'view',
        pageid: 'data-and-privacy',
        uri: this.route.url,
        subtype: 'paginate',
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
    /*telemetry inplementation for space*/
  }

}
