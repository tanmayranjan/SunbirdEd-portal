import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '@sunbird/core';
import { ConfigService, NavigationHelperService } from '@sunbird/shared';
import { BadgesService } from '../../../core/services/badges/badges.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IImpressionEventInput } from '@sunbird/telemetry';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {
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

    if (this.activatedRoute.params['value'].status === 'Review') {
      const option = {
        url : '/content/v1/search',
        param : '',
        filters: {
          language: ['English'],
          contentType: ['Resource'],
          status: ['Review'],
          identifier: [this.activatedRoute.snapshot.params.contentId]
      },
        sort_by: {me_averageRating: 'desc'}
      };
      this.contentService.getupForReviewData(option).subscribe(data => {
          console.log('read content', data);
          this.assetDetail = this.sanitizer.bypassSecurityTrustResourceUrl(data.result.content[0].artifactUrl);
          this.showLoader = false;

    });
  } else {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${this.activatedRoute.snapshot.params.contentId}`,
    };
    this.contentService.get(req).subscribe(data => {
      console.log('data in pdf = ', data);
      this.assetDetail = this.sanitizer.bypassSecurityTrustResourceUrl(data.result.content.artifactUrl);
      this.showLoader = false;
    });
  }
    this.checkForPreviousRouteForRedirect();
    this.telemetryImpression = {
      context: {
        env: 'space'
      },
      edata: {
        type: 'view',
        pageid: 'myassets-details-pdfviewer',
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

      if (this.path === 'Review') {
        this.contentId = url[1].path;
      } else {
        this.contentId = url[1].path;
      }

    });
    if (this.path === 'pdfReview') {
      this.status = 'Review';
      this.route.navigate(['upForReview/review/detail', this.contentId]);
    } else {
      this.status = this.path;
      this.route.navigate(['myassets/detail/', this.contentId, this.status]);
    }

  }
}
