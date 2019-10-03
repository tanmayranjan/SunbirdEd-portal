import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService, AssetService } from '@sunbird/core';
import { ConfigService, NavigationHelperService } from '@sunbird/shared';
import { BadgesService } from '@sunbird/core';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import {
  ToasterService, ServerResponse ,
  ResourceService, IUserData
} from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { Location } from '@angular/common';
import { IImpressionEventInput, TelemetryObject } from '@sunbird/telemetry';
export interface IassessDetail {
  name: string;
  link: string;
  since: string;
  year: string;
  region: string;
  board: string;
  gradeLevel: Array<any>;
  topic: Array<any>;
  keywords: Array<any>;
  description: string;
  version: string;
  creators: string;
  creator: string;
  artifactUrl: string;
  mimeType: string;
  lastSubmittedOn: string;
  sector: string;
  assetType: string;
  source: string;
  submittedBy: string;

}

@Component({
  selector: 'app-explore-detail-page',
  templateUrl: './explore-detail-page.component.html',
  styleUrls: ['./explore-detail-page.component.scss']
})
export class ExploreDetailPageComponent implements OnInit {

  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<{ data: string }, string, string>;
  badgeList: any;
  showLoader = true;
  add = false;
  success = false;
  user: any;
  public userService: UserService;
  public activatedRoute: ActivatedRoute;
  public configService: ConfigService;
  public contentService: ContentService;
  badgeService: BadgesService;
  public contentId;
  public route: Router;
  counterVar = false;
  public assetDetail: IassessDetail = {
    name: '',
    link: '',
    since: '',
    year: '',
    region: '',
    board: '',
    gradeLevel: [],
    topic: [],
    keywords: [],
    description: '',
    version: '',
    creators: '',
    creator: '',
    artifactUrl: '',
    mimeType: '',
    lastSubmittedOn: '',
    sector: '',
    assetType: '',
    source: '',
    submittedBy: ''

  };
  public resourceService: ResourceService;
  private toasterService: ToasterService;
  pdfs: any;
  url: any;
  public telemetryImpression: IImpressionEventInput;
  public telemetryImpressionObject: TelemetryObject;
  contentuploaded: any;
  constructor(activated: ActivatedRoute, public modalServices: SuiModalService , public modalService: SuiModalService,
    badgeService: BadgesService,  toasterService: ToasterService, resourceService: ResourceService, userService: UserService,
    config: ConfigService, contentServe: ContentService , rout: Router,
    public assetService: AssetService, public navigationhelperService: NavigationHelperService,
    private location: Location) {
    this.activatedRoute = activated;
    this.activatedRoute.url.subscribe(url => {
      this.contentId = url[1].path;
    });
    this.configService = config;
    this.contentService = contentServe;
    this.badgeService = badgeService;
    this.route = rout;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.userService = userService;
   }

  ngOnInit() {
    // this.activatedRoute.queryParams()
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${this.activatedRoute.snapshot.params.contentId}`,
    };
    this.contentService.get(req).subscribe(data => {
      this.assetDetail = data.result.content;
      if (data.result.content.artifactUrl && data.result.content.mimeType !== 'video/x-youtube') {

      this.contentuploaded = data.result.content.artifactUrl.substring(data.result.content.artifactUrl.lastIndexOf('/')).slice(1);
      }
      /*telemetry inplementation for space*/
      this.telemetryImpressionObject = {
        id: this.assetDetail['identifier'],
        type: 'asset',
        rollup: {
          name: this.assetDetail['name'],
          resource: 'asset',
          assetType : this.assetDetail['contentType']
      }
      };
      if (this.counterVar === false) {
        this.setTelemetryData(this.telemetryImpressionObject);
      }
      this.userService.userData$.subscribe(
        (user: IUserData) => {
          this.user = user.userProfile.userRoles;
          this.setTelemetryData(this.telemetryImpressionObject);
      });
      /*telemetry inplementation for space*/
    });

    const request = {
      request: {
        filters: {
          issuerList: [],
          rootOrgId: '0127121193133670400',
          roles: ['TEACHER_BADGE_ISSUER'],
          type: 'content'
        }
      }
    };
    this.badgeService.getAllBadgeList(request).subscribe((data) => {
      this.badgeList = data.result.badges;
    });
  }
  assignBadge(issuerId, badgeId) {
    this.success = true;
    const req = {
      request: {
        recipientId: this.contentId,
        recipientType: 'content',
        issuerId: issuerId,
        badgeId: badgeId
      }

    };
    this.badgeService.createAssertion(req).subscribe((data) => {
    });
    this.callAlert();
  }
  callAlert() {
    alert('Badge added Successfully');
  }
  navigateToDetailsPage() {
    this.location.back();
/*
if (this.user) {
  this.route.navigate(['/resources']);
} else {
  this.route.navigate(['space/explore']);
} */
  }
  navigateToView() {
    this.url = this.activatedRoute.snapshot.params;
    console.log('activate route = ', this.activatedRoute, this.url);
    this.route.navigate(['space/explore/player/content/' + this.url.contentId + '/view']);
  }
  public deleteConfirmModal(issuerId, badgeId) {
    this.add = true;
    const config = new TemplateModalConfig<{ data: string }, string, string>(this.modalTemplate);
    config.isClosable = true;
    config.size = 'mini';
    this.modalService
      .open(config)
      .onApprove(result => {
        const req = {
          request: {
            recipientId: this.contentId,
            recipientType: 'content',
            issuerId: issuerId,
            badgeId: badgeId
          }

        };
        this.badgeService.createAssertion(req).subscribe((data) => {
             this.showLoader = false;
             this.toasterService.success('Badge Added successfully');
           },
           (err: ServerResponse) => {
             this.showLoader = false;
             this.toasterService.error('Adding Badge failed Please try again later');
           }
         );
       })
       .onDeny(result => {
       });
   }

   setTelemetryData(assetObj) {
     this.counterVar = true;
     if (this.user) {
      this.telemetryImpression = {
        context: {
          env: 'sharedassets'
        }, object: assetObj,
        edata: {
          type: 'view',
          pageid: 'sharedassets-details-page',
          uri: this.route.url,
          subtype: 'paginate',
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
     } else {
      this.telemetryImpression = {
        context: {
          env: 'sharedassets'
        }, object: assetObj,
        edata: {
          type: 'view',
          pageid: 'exploreassets-details-page',
          uri: this.route.url,
          subtype: 'paginate',
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
     }
   }
}
