import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import * as _ from 'lodash';
@Component({
  selector: 'app-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})
export class MainFooterComponent implements OnInit {
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /*
  Date to show copyright year
  */
  date = new Date();
  /*
  Hide or show footer
  */
  showFooter = true;
  applyCss = true;
  constructor(resourceService: ResourceService,
    public router: Router,
    public activatedRoute: ActivatedRoute) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      const url = event.url;
      if (url.includes('explore-course')) {
        console.log('footerrrrrrr');
        this.applyCss = true;
      }
     }
    });
    // console.log(this.activatedRoute.url);
  }

}
