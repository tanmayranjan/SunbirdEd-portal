import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService, PlayerService } from '@sunbird/core';
import { ConfigService, NavigationHelperService } from '@sunbird/shared';
import { BadgesService } from '@sunbird/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { Location } from '@angular/common';
import { AssetService } from '../../../../../core/services/asset/asset.service';

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
  public userService: UserService;
  assetDetail: any;
  sanitizer: any;
  showLoader = true;
  loaderMessage = 'Loading pdf please wait';
  path: string;
  status: any;
  telemetryImpression: IImpressionEventInput;
  epub: boolean;
  playerConfig: any;
  constructor(activated: ActivatedRoute, sanitizers: DomSanitizer, userService: UserService, public location: Location,
    config: ConfigService, contentServe: ContentService, private router: Router, public navigationHelperService: NavigationHelperService,
    public playerservice: PlayerService, public assetService: AssetService
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
    this.userService = userService;

  }

  ngOnInit() {

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
    this.checkForPreviousRouteForRedirect();
    this.telemetryImpression = {
      context: {
        env: 'space'
      },
      edata: {
        type: 'view',
        pageid: 'exploreassets-details-pdfviewer',
        uri: this.route.url,
        subtype: 'paginate',
        duration: this.navigationHelperService.getPageLoadTime()
      }
    };

    this.userService.userData$.subscribe((user) => {
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
    });
  }
  checkForPreviousRouteForRedirect() {
    const previousUrlObj = this.navigationHelperService.getPreviousUrl();
    if (previousUrlObj && previousUrlObj.url && (previousUrlObj.url !== '/myassets')) {
      // this.redirect();
    }
  }

  navigateToDetailsPage() {
    history.back();
    /* this.activatedRoute.url.subscribe(url => {
      console.log('url = ',  url);
      this.path = url[2 ].path;
      this.route.navigate(['space/explore/player/content/' + this.path]);
    }); */
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
