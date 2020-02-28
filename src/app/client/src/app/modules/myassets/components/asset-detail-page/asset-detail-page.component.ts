import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService, UserService, AssetService } from '@sunbird/core';
import { ConfigService, NavigationHelperService } from '@sunbird/shared';
import { Location } from '@angular/common';
import { BadgesService } from '../../../core/services/badges/badges.service';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import {
  ToasterService, ServerResponse,
  ResourceService, IUserData
} from '@sunbird/shared';
import { IImpressionEventInput, TelemetryObject } from '@sunbird/telemetry';
import { MyassetsService } from '../../services/my-assets/myassets.service';
import * as _ from 'lodash-es';
import { SearchService } from '../../../core/services/search/search.service';
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
  artifactUrl: string;
  mimeType: string;
  badgeAssertions: Array<any>;
  submittedBy: string;
  source: string;
  assetType: string;
  sector: string;
}
@Component({
  selector: 'app-asset-detail-page',
  templateUrl: './asset-detail-page.component.html',
  styleUrls: ['./asset-detail-page.component.scss']
})
export class AssetDetailPageComponent implements OnInit {
  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<{ data: string }, string, string>;
  badgeList: any;
  showLoader = true;
  add = false;
  success = false;
  user: any;
  state: string;
  public userService: UserService;
  public activatedRoute: ActivatedRoute;
  public configService: ConfigService;
  public contentService: ContentService;
  badgeService: BadgesService;
  public contentId;
  public route: Router;
  telemetryImpression: IImpressionEventInput;
  telemetryImpressionObject: TelemetryObject;
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
    artifactUrl: '',
    mimeType: '',
    badgeAssertions: [],
    submittedBy: '',
    source: '',
    assetType: '',
    sector: ''
  };
  public resourceService: ResourceService;
  private toasterService: ToasterService;
  orgId: any;
  role: any;
  verified = false;
  loaderMessage: {};
  reasons: Array<string>;
  userId: any;
  // capture previous url state for publish visibility
  visible = false;
  pdfs: string;
  path: string;
  lockPopupData: object;
  /**
   * To show content locked modal
  */
  showLockedContentModal = false;
  content: any;
  status: string;
  urlPath: string;
  id: string;
  pageid: string;
  contentuploaded: any;
  constructor(activated: ActivatedRoute, public modalServices: SuiModalService, public modalService: SuiModalService,
    badgeService: BadgesService, toasterService: ToasterService, resourceService: ResourceService, userService: UserService,
    config: ConfigService, contentServe: ContentService, rout: Router, private location: Location,
    public workSpaceService: MyassetsService, public assetService: AssetService, public navigationhelperService: NavigationHelperService,
    public searchService: SearchService) {
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
    this.state = 'allcontent';
  }
  ngOnInit() {
    if (this.route.url.indexOf('review/detail') > -1) {
      this.visible = true;
      this.pageid = 'review-asset-detail-page';
    } else {
      this.visible = false;
      this.pageid = 'my-asset-detail-page';
    }
    this.activatedRoute.url.subscribe(url => {
      this.path = url[2].path;
    });
    if (this.path === 'Live') {
      // const req = {
      //   url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${this.activatedRoute.snapshot.params.contentId}`,
      // };
      const req = {
        url: `${this.configService.urlConFig.URLS.ASSET.READASSET}/${this.activatedRoute.snapshot.params.contentId}`,
      };
      this.assetService.read(req).subscribe(data => {
        this.content = data.result.asset;
        this.assetDetail = data.result.asset;
        this.showLoader = false;
        if (this.content.source) {
          if (this.content.source.includes('youtube')) {
            this.contentuploaded = this.content.source;
          } else {
            this.contentuploaded = this.content.source.substring(this.content.source.lastIndexOf('/') + 1);
          }
        }
        this.telemetryImpressionObject = {
          id: this.assetDetail['identifier'],
          type: 'asset',
          rollup: {
            name: this.assetDetail['name'],
            resource: 'asset',
            assetType: this.assetDetail['assetType']
          }
        };
        this.telemetryImpression = {
          context: {
            env: this.pageid
          }, object: this.telemetryImpressionObject,
          edata: {
            type: 'view',
            pageid: this.pageid,
            uri: this.route.url,
            subtype: 'paginate',
            duration: this.navigationhelperService.getPageLoadTime()
          }
        };
      });
    } else if (this.path === 'Draft' || this.path === 'Review') {
      //  const req = {
      //    url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${this.activatedRoute.snapshot.params.contentId}/?mode=edit`,
      //  };
      const req = {
        url: `${this.configService.urlConFig.URLS.ASSET.READASSET}/${this.activatedRoute.snapshot.params.contentId}`,
      };
      this.assetService.read(req).subscribe(data => {
        console.log('read content', data);
        this.content = data.result.asset;
        this.assetDetail = data.result.asset;
        this.showLoader = false;
        if (this.content.source) {

          if (this.content.source.includes('youtube')) {
            this.contentuploaded = this.content.source;
          } else {
            this.contentuploaded = this.content.source.substring(this.content.source.lastIndexOf('/') + 1);
          }
        }
        this.telemetryImpressionObject = {
          id: this.assetDetail['identifier'],
          type: 'asset',
          rollup: {
            name: this.assetDetail['name'],
            resource: 'asset',
            assetType: this.assetDetail['assetType']
          }
        };
        this.telemetryImpression = {
          context: {
            env: this.pageid
          }, object: this.telemetryImpressionObject,
          edata: {
            type: 'view',
            pageid: this.pageid,
            uri: this.route.url,
            subtype: 'paginate',
            duration: this.navigationhelperService.getPageLoadTime()
          }
        };
      });
    } else {

      //   const req = {
      //   url: `${this.configService.urlConFig.URLS.ASSET.READASSET}/${this.activatedRoute.snapshot.params.contentId}`,
      // };
      const option = {
        url: this.configService.urlConFig.URLS.COMPOSITE.SEARCH,
        param: '',
        filters: {
          objectType: 'Asset',
          status: ['Review'],
          identifier: [this.path]
        },
        sort_by: { me_averageRating: 'desc' }
      };
      this.searchService.compositeSearch(option).subscribe(data => {
        console.log('read content', data);
        this.content = data.result.Asset[0];
        this.assetDetail = data.result.Asset[0];
        this.showLoader = false;
        if (this.content.source) {
          if (this.content.source.includes('youtube')) {
            this.contentuploaded = this.content.source;
          } else {
            this.contentuploaded = this.content.source.substring(this.content.source.lastIndexOf('/') + 1);
          }
        }
        this.telemetryImpressionObject = {
          id: this.assetDetail['identifier'],
          type: 'asset',
          rollup: {
            name: this.assetDetail['name'],
            resource: 'asset',
            assetType: this.assetDetail['assetType']
          }
        };
        this.telemetryImpression = {
          context: {
            env: this.pageid
          }, object: this.telemetryImpressionObject,
          edata: {
            type: 'view',
            pageid: this.pageid,
            uri: this.route.url,
            subtype: 'paginate',
            duration: this.navigationhelperService.getPageLoadTime()
          }
        };
      });
    }
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        this.user = user.userProfile.userRoles;
        this.orgId = user.userProfile.rootOrgId;
        this.userId = this.userService.userid;
        this.user.forEach(element => {
          if (element === 'TEACHER_BADGE_ISSUER') {
            this.role = element;
          }
        });
      });
    const request = {
      request: {
        filters: {
          issuerList: [],
          rootOrgId: this.orgId,
          roles: [this.role],
          type: 'content'
        }
      }
    };
    this.badgeService.getAllBadgeList(request).subscribe((data) => {
      this.badgeList = data.result.badges;
    });
    const link = this.assetDetail.link.slice(0, 4);
    console.log('check link = ', link, this.assetDetail);
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
    if (this.route.url.indexOf('/review/detail/do_') > -1) {
      this.route.navigate(['/upForReview']);
    } else {
      this.route.navigate(['myassets']);
    }
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
          this.verified = !true;
          this.toasterService.success('Badge Added successfully');
          this.ngOnInit();
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
  rejectAsset(contentId) {
    // const option = {
    //   url: `${this.configService.urlConFig.URLS.CONTENT.REJECT}/${contentId}`
    //  };
    // this.contentService.post(option).subscribe(
    const option = {
      asset: {
        identifier: contentId,
        status: 'Draft'
      }
    };
    this.assetService.update(option).subscribe(
      (data: ServerResponse) => {
        this.showLoader = false;
        // this.resourceService.messages.smsg.m0004
        this.toasterService.success('Asset has been rejected successfully');
        if (!localStorage.hasOwnProperty(contentId)) {
          localStorage.setItem(contentId, JSON.stringify('Review'));
        }
        setTimeout(() => {
          this.route.navigate(['upForReview']);
          this.ngOnInit();
        }, 1800);
      }, (err) => {
        this.showLoader = false;
        this.toasterService.error('An error occured while rejecting the asset');
      });
  }
  publishAsset(contentId) {
    this.showLoader = true;
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0034,
    };
    this.reasons = ['Content plays correctly',
      'Can see the content clearly on Desktop and App',
      'No Hate speech, Abuse, Violence, Profanity',
      'No Sexual content, Nudity or Vulgarity',
      'Relevant Keywords',
      'Appropriate tags such as Resource Type, Concepts',
      'Correct Board, Grade, Subject, Medium',
      'Appropriate Title, Description',
      'No Discrimination or Defamation',
      'Is suitable for children',
      'Audio (if any) is clear and easy to understand',
      'No Spelling mistakes in the text',
      'Language is simple to understand'];
    const requestBody = {
      request: {
        content: {
          publishChecklist: this.reasons,
          lastPublishedBy: this.userId
        }
      }
    };
    //  const option = {
    //    url: `${this.configService.urlConFig.URLS.CONTENT.PUBLISH}/${contentId}`,
    //    data: requestBody
    //  };
    // this.contentService.post(option).subscribe(
    const option = {
      asset: {
        identifier: contentId,
        status: 'Live'
      }
    };
    this.assetService.update(option).subscribe(
      (data: ServerResponse) => {
        this.showLoader = false;
        this.toasterService.success('Asset has been sucessfully published');
        if (!localStorage.hasOwnProperty(contentId)) {
          localStorage.setItem(contentId, JSON.stringify('Review'));
        }
        setTimeout(() => {
          this.route.navigate(['upForReview']);
          this.ngOnInit();
        }, 1800);
      }, (err) => {
        this.showLoader = false;
        this.toasterService.error('An error occured while publishing the asset.');
      });
  }
  navigateToplay() {
    this.activatedRoute.url.subscribe(url => {
      console.log('url = ', url);
      this.status = url[2].path;
      this.urlPath = url[0].path;
      this.id = url[2].path;
    });
    if (this.urlPath === 'detail') {
      this.route.navigate(['myassets/play/', this.contentId, this.status]);
    }
    if (this.urlPath === 'review') {
      this.status = 'Review';
      this.route.navigate(['upForReview/play/', this.id, this.status]);
    }
  }
  contentClick() {
    if (_.size(this.content.lockInfo)) {
      this.lockPopupData = this.content;
      this.showLockedContentModal = true;
    } else {
      const status = this.content.status.toLowerCase();
      if (status === 'processing') {
        return;
      }
      if (status === 'draft') { // only draft state contents need to be locked
        this.workSpaceService.navigateToContent(this.content, this.state);
      } else {
        this.workSpaceService.navigateToContent(this.content, this.state);
      }
    }
  }
}
