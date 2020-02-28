import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService, AssetService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { BadgesService } from '../../../core/services/badges/badges.service';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import {
  ToasterService, ServerResponse ,
  ResourceService, IUserData, NavigationHelperService
} from '@sunbird/shared';
import { UserService } from '@sunbird/core';
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
  badgeAssertions: Array<any>;
  artifactUrl: string;
  mimeType: string;
  lastSubmittedOn;
  sector: string;
  assetType: string;
  source: string;
  submittedBy: string;
}

@Component({
  selector: 'app-shared-detail-page',
  templateUrl: './shared-detail-page.component.html',
  styleUrls: ['./shared-detail-page.component.scss']
})
export class SharedDetailPageComponent implements OnInit {
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
    badgeAssertions: [],
    artifactUrl: '',
    mimeType: '',
    lastSubmittedOn: '',
    sector: '' ,
    assetType: '',
    source: '',
    submittedBy: ''
};
  public resourceService: ResourceService;
  private toasterService: ToasterService;
  pdfs: any;
  telemetryImpression: IImpressionEventInput;
  telemetryImpressionObject: TelemetryObject;
  constructor(activated: ActivatedRoute, public modalServices: SuiModalService , public modalService: SuiModalService,
    badgeService: BadgesService,  toasterService: ToasterService, resourceService: ResourceService, userService: UserService,
    config: ConfigService, contentServe: ContentService , rout: Router,
    public assetService: AssetService, public navigationhelperService: NavigationHelperService) {
    this.activatedRoute = activated;
    this.activatedRoute.url.subscribe(url => {
      this.contentId = url[2].path;
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
console.log('param = ', this.activatedRoute.snapshot.params.contentId);
this.contentId = this.activatedRoute.snapshot.params.contentId;
// const req = {
//   url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${this.activatedRoute.snapshot.params.contentId}`,
// };
// this.contentService.get(req).subscribe(data => {
  const req = {
    url: `${this.configService.urlConFig.URLS.ASSET.READASSET}/${this.activatedRoute.snapshot.params.contentId}`,
  };
  this.assetService.read(req).subscribe(data => {

  this.assetDetail = data.result.asset;
  this.pdfs = data.result.asset.source.substring(data.result.asset.source.lastIndexOf('/') + 1 ,
  data.result.asset.source.lastIndexOf('.'));

  this.telemetryImpressionObject = {
    id: this.assetDetail['identifier'],
    type: 'asset',
    rollup: {
      name: this.assetDetail['name'],
      resource: 'asset',
      assetType : this.assetDetail['assetType']
  }
  };
  this.telemetryImpression = {
    context: {
      env: 'sharedassets'
    }, object: this.telemetryImpressionObject,
    edata: {
      type: 'view',
      pageid: 'shared-asset-detail-page',
      uri: this.route.url,
      subtype: 'paginate',
      duration: this.navigationhelperService.getPageLoadTime()
    }
  };
});
    const request = {
      request: {
        filters: {
          issuerList: [],
          rootOrgId: '01279840588057804865',
          roles: ['TEACHER_BADGE_ISSUER'],
          type: 'content'
        }
      }
    };
    this.badgeService.getAllBadgeList(request).subscribe((data) => {

      this.badgeList = data.result.badges;
    });
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        this.user = user.userProfile.userRoles;

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
    this.route.navigate(['resources']);

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
   navigateToPlayer() {
     this.route.navigate(['resources/player/content/' + this.contentId + '/view']);
   }
}
