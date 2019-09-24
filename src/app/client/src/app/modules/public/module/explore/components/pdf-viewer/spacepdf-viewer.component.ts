import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '@sunbird/core';
import { ConfigService, NavigationHelperService } from '@sunbird/shared';
import { BadgesService } from '@sunbird/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-spacepdf-viewer',
  templateUrl: './spacepdf-viewer.component.html',
  styleUrls: ['./spacepdf-viewer.component.scss']
})
export class SpacepdfViewerComponent implements OnInit {
  public activatedRoute: ActivatedRoute;
  public configService: ConfigService;
  public contentService: ContentService;
  public contentId;
  public route: Router;
  assetDetail: any;
  sanitizer: any;
  showLoader = true;
  loaderMessage = 'Loading pdf please wait';
  path: string;
  status: any;
  telemetryImpression: IImpressionEventInput;
  constructor(activated: ActivatedRoute, sanitizers: DomSanitizer,
    config: ConfigService, contentServe: ContentService, private router: Router, public navigationHelperService: NavigationHelperService,
  ) {
    this.activatedRoute = activated;
    this.activatedRoute.url.subscribe(url => {
      this.contentId = url[1].path;
    });
    this.configService = config;
    this.contentService = contentServe;
    this.sanitizer = sanitizers;
    this.showLoader = true;
    this.route = router;

  }

  ngOnInit() {

    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${this.activatedRoute.snapshot.params.contentId}`,
    };
    this.contentService.get(req).subscribe(data => {
      console.log('data in pdf = ', data);
      this.assetDetail = this.sanitizer.bypassSecurityTrustResourceUrl(data.result.content.artifactUrl);
      this.showLoader = false;
    });
    this.checkForPreviousRouteForRedirect();

    this.telemetryImpression = {
      context: {
        env: 'space'
      },
      edata: {
        type: 'view',
        pageid: 'sharedassets-details-pdfviewer',
        uri: this.route.url,
        subtype: 'paginate',
        duration: this.navigationHelperService.getPageLoadTime()
      }
    };
  }
  checkForPreviousRouteForRedirect() {
    const previousUrlObj = this.navigationHelperService.getPreviousUrl();
    if (previousUrlObj && previousUrlObj.url && (previousUrlObj.url !== '/myassets')) {
      // this.redirect();
    }
  }

  navigateToDetailsPage() {
    this.activatedRoute.url.subscribe(url => {
      console.log('url = ',  url);
      this.path = url[2 ].path;
      this.route.navigate(['space/explore/player/content/' + this.path]);
    });
  }
      // if (this.path === 'pdfReview') {
      //   this.contentId = url[1].path;
      // }
      // } else {
      //   this.contentId = url[1].path;
      // }

    // });
    // if (this.path === 'pdfReview') {
    //   this.status = 'Review';
    //   this.route.navigate(['upForReview/review/detail', this.contentId]);
    // } else {
    //   this.status = this.path;
    //   this.route.navigate(['myassets/detail/', this.contentId, this.status]);
    // }

  }
