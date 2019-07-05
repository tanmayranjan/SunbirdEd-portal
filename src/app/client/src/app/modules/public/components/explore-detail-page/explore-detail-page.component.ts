import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { BadgesService } from '../../../core/services/badges/badges.service';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import {
  ToasterService, ServerResponse ,
  ResourceService, IUserData
} from '@sunbird/shared';
import { UserService } from '@sunbird/core';
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

  };
  public resourceService: ResourceService;
  private toasterService: ToasterService;
  pdfs: any;
  constructor(activated: ActivatedRoute, public modalServices: SuiModalService , public modalService: SuiModalService,
    badgeService: BadgesService,  toasterService: ToasterService, resourceService: ResourceService, userService: UserService,
    config: ConfigService, contentServe: ContentService , rout: Router) {
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
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${this.activatedRoute.snapshot.params.contentId}`,
    };
    this.contentService.get(req).subscribe(data => {
      this.assetDetail = data.result.content;
      this.pdfs = data.result.content.artifactUrl.substring(data.result.content.artifactUrl.lastIndexOf('/'),
      data.result.content.artifactUrl.lastIndexOf('pdf'));
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
    this.route.navigate(['explore']);
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

}
