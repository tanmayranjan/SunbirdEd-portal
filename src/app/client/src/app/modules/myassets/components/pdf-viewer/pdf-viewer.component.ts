import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService, PlayerService } from '@sunbird/core';
import { ConfigService, NavigationHelperService } from '@sunbird/shared';
import { BadgesService } from '../../../core/services/badges/badges.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { AssetService } from '../../../core/services/asset/asset.service';

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
  playerConfig: any;
  epub = false;
  constructor(activated: ActivatedRoute, sanitizers: DomSanitizer,
    config: ConfigService, contentServe: ContentService, private router: Router, public navigationHelperService: NavigationHelperService,
   public playerservice: PlayerService, public assetService: AssetService,
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
        url : `${this.configService.urlConFig.URLS.ASSET.READASSET}/${this.activatedRoute.snapshot.params.contentId}`,
      };
      this.assetService.read(option).subscribe(data => {
          console.log('read content', data);
          // if (data.result.content[0].mimeType === 'application/epub') {
          //   this.epub = true;
          //   const newobj = {'contentData': data.result.content[0], 'contentId': data.result.content[0].identifier};
          //  this.playerConfig = this.playerservice.getConfig(newobj);

          // }
          this.assetDetail = this.sanitizer.bypassSecurityTrustResourceUrl(data.result.asset.source);
          this.showLoader = false;

    });
  } else {
    // const req = {
    //   url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${this.activatedRoute.snapshot.params.contentId}`,
    // };
    // this.contentService.get(req).subscribe(data => {
      const option = {
        url : `${this.configService.urlConFig.URLS.ASSET.READASSET}/${this.activatedRoute.snapshot.params.contentId}`,
      };
      this.assetService.read(option).subscribe(data => {
      console.log('data in pdf = ', data);
    // if (data.result.content['mimeType'] === 'application/epub') {
    //   this.epub = true;
    //   const newobj = {'contentData': data.result.content, 'contentId': data.result.content.identifier};
    //  this.playerConfig = this.playerservice.getConfig(newobj);

    // }
      this.assetDetail = this.sanitizer.bypassSecurityTrustResourceUrl(data.result.asset.source);
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
     if (this.path === 'pdfReview' || this.route.url.indexOf('upForReview') > -1) {
      this.status = 'Review';
      this.route.navigate(['upForReview/review/detail', this.contentId]);
    } else {
      this.status = this.path;
      this.route.navigate(['myassets/detail/', this.contentId, this.status]);
    }

  }
}
