import { combineLatest as observableCombineLatest, Observable, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyAsset } from '../../classes/myasset';
import { SearchService, UserService, ISort, FrameworkService, PermissionService, ContentService, AssetService} from '@sunbird/core';
import {
  ServerResponse, PaginationService, ConfigService, ToasterService,
  ResourceService, ILoaderMessage, INoResultMessage, IContents, NavigationHelperService
} from '@sunbird/shared';
import { Ibatch, IStatusOption } from '../../../workspace/interfaces/';
import { MyassetsService } from '../../services/my-assets/myassets.service';
import { IPagination } from '@sunbird/announcement';
import * as _ from 'lodash-es';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { ICard } from '../../../shared/interfaces/card';
import { BadgesService } from '../../../core/services/badges/badges.service';
import { IUserData } from '@sunbird/shared';
import { Location } from '@angular/common';
import { getPluralCategory } from '@angular/common/src/i18n/localization';


@Component({
  selector: 'app-myassest-page',
  templateUrl: './myassest-page.component.html',
  styleUrls: ['./myassest-page.component.scss']
})
export class MyassestPageComponent extends MyAsset implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modalTemplate')
  // @ViewChild('modalTemplate2')
  public modalTemplate: ModalTemplate<{ data: string }, string, string>;
  // public modalTemplate2: ModalTemplate<{data: string}, string, string>;
  /**
     * state for content editior
    */

  state: string;
  mainState: any;
  /**
   * To store the content available for upForReview
   */

  /**
   * To navigate to other pages
   */
  route: Router;

  /**
   * To send activatedRoute.snapshot to router navigation
   * service for redirection to draft  component
  */
  private activatedRoute: ActivatedRoute;

  /**
   * Contains unique contentIds id
  */
  contentIds: string;
  /**
   * Contains list of published course(s) of logged-in user
  */
  // allContent: Array<IContents> = [];
  allContent: Array<ICard> = [];
  upForReviewContent = [];

  /**
   * To show / hide loader
  */
  showLoader = true;

  /**
   * loader message
  */
  loaderMessage: ILoaderMessage;

  /**
  Modal message stores the message to display in the generic modal template */
modalMessage = '';
  /**
   * To show / hide no result message when no result found
  */
  noResult = false;

  /**
   * lock popup data for locked contents
  */
  lockPopupData: object;

  /**
   * To show content locked modal
  */
  showLockedContentModal = false;

  /**
   * To show / hide error
  */
  showError = false;

  /**
   * no result  message
  */
  noResultMessage: INoResultMessage;

  /**
  to show no results on upForReview tab
  */
  noResultsForReview = false;

  /**
    * For showing pagination on draft list
  */
  private paginationService: PaginationService;

  /**
  * To get url, app configs
  */
  public config: ConfigService;
  /**
  * Contains page limit of inbox list
  */
  pageLimit: number;
  /**
  * Current page number of inbox list
  */
  pageNumber = 1;

  /**
  * totalCount of the list
  */
  totalCount: Number;
  /**
    status for preselection;
  */
  status: string;
  /**
  route query param;
  */
  queryParams: any;
  /**
  redirectUrl;
  */
  public redirectUrl: string;
  /**
  filterType;
  */
  public filterType: string;
  /**
  sortingOptions ;
  */
  public sortingOptions: Array<ISort>;
  /**
  sortingOptions ;
  */
  sortByOption: string;
  /**
  sort for filter;
  */
  sort: object;
  /**
	 * inviewLogs
	*/
  inviewLogs = [];
  /**
* value typed
*/
  query: string;
  /**
  * Contains returned object of the pagination service
  * which is needed to show the pagination on all content view
  */
  pager: IPagination;

  /**
  * To show toaster(error, success etc) after any API calls
  */
  private toasterService: ToasterService;
  /**
	 * telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;
  /**
  * To call resource service which helps to use language constant
  *
  */
  orgDetailsUnsubscribe: Subscription;
  badgeService: BadgesService;
  public frameworkService: FrameworkService;
  public resourceService: ResourceService;
  public permissionService: PermissionService;
  public contentService: ContentService;
  lessonRole: any;
  userId: string;
  reasons = [];
  deleteAsset = false;
  publishAsset = false;
  badgeList: any;
  user: any;
  orgId: any;
  role: any;
  userDetails: any;
  public paramType = [
    'assetType',
    'focusArea',
    'organization',
    'region',
    'board',
    'channel',
    'gradeLevel',
    'topic',
    'languages',
    'country'
  ];
  public qparam = [];
  copystate: any;
  copycontentid: string;
  copied = {};
  channelname: any;
  /**
    * Constructor to create injected service(s) object
    Default method of Draft Component class
    * @param {SearchService} SearchService Reference of SearchService
    * @param {UserService} UserService Reference of UserService
    * @param {Router} route Reference of Router
    * @param {PaginationService} paginationService Reference of PaginationService
    * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
    * @param {ConfigService} config Reference of ConfigService
  */
  constructor(public searchService: SearchService,
    public workSpaceService: MyassetsService,
    badgeService: BadgesService,
    paginationService: PaginationService,
    activatedRoute: ActivatedRoute,
    route: Router, userService: UserService,
    permissionService: PermissionService, public navigationhelperService: NavigationHelperService,
    toasterService: ToasterService, resourceService: ResourceService,
    config: ConfigService, public modalService: SuiModalService,
    public modalServices: SuiModalService, frameworkService: FrameworkService,
    contentService: ContentService, public assetService: AssetService) {
    super(searchService, workSpaceService, userService);
    this.paginationService = paginationService;
    this.route = route;
    this.activatedRoute = activatedRoute;
    this.toasterService = toasterService;
    this.resourceService = resourceService;
    this.config = config;
    this.permissionService = permissionService;
    this.badgeService = badgeService;
    this.route.onSameUrlNavigation = 'reload';
    this.frameworkService = frameworkService;
    this.contentService = contentService;

    this.state = 'allcontent';
    this.loaderMessage = {
      'loaderMessage': this.resourceService.messages.stmsg.m0110,
    };
    this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.sortingOptions;
  }

  ngOnInit() {
   console.log('myasset page');
    this.userId = this.userService.userid;
    this.lessonRole = this.config.rolesConfig.workSpaceRole.lessonRole;

    this.filterType = this.config.appConfig.allmycontent.filterType;
    this.redirectUrl = this.config.appConfig.allmycontent.inPageredirectUrl;
    this.frameworkService.initialize();

    observableCombineLatest(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      (params: any, queryParams: any) => {
        return {
          params: params,
          queryParams: queryParams
        };
      })
      .subscribe(bothParams => {
        if (bothParams.params.pageNumber) {
          this.pageNumber = Number(bothParams.params.pageNumber);
        }
        this.queryParams = bothParams.queryParams;
        this.query = this.queryParams['query'];
        console.log('both params = ', bothParams.queryParams, this.activatedRoute);
        this.fecthAllContent(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber, bothParams);

      });
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        this.userDetails = user.userProfile;
        this.channelname = user.userProfile.channel;
        this.user = user.userProfile.userRoles;
        this.orgId = user.userProfile.rootOrgId;
        this.user.forEach(element => {
          if (element === 'TEACHER_BADGE_ISSUER') {
            this.role = element;          }
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
      this.badgeList = data.result.content;
    });
/*telemetry implementation for space*/
    this.telemetryImpression = {
      context: {
        env: this.getRouteDetail()
      },
      edata: {
        type: 'view',
        pageid: this.getRouteDetail(),
        uri: this.route.url,
        subtype: 'paginate',
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
    /*telemetry implementation for space*/
  }

ngAfterViewInit() {
  console.log('after view in it');
  sessionStorage.clear();
  setTimeout(() => {
    this.showLoader = false;
    // this.ngOnInit();
  }, 500);
}

  /**
  * This method sets the make an api call to get all UpForReviewContent with page No and offset
  */
  fecthAllContent(limit: number, pageNumber: number, bothParams) {

    this.showLoader = true;
    if (bothParams.queryParams.sort_by) {
      const sort_by = bothParams.queryParams.sort_by;
      const sortType = bothParams.queryParams.sortType;
      this.sort = {
        [sort_by]: _.toString(sortType)
      };
    } else {
      this.sort = { lastUpdatedOn: this.config.appConfig.WORKSPACE.lastUpdatedOn };
    }
  /*  const preStatus = [];
    const searchParams = {
      filters: {
        status: bothParams.queryParams.status ? bothParams.queryParams.status : preStatus,
        // createdBy: this.userService.userid,
        // contentType: this.config.appConfig.WORKSPACE.contentType,
        objectType: 'Asset',
        assetType: [],
        subject: bothParams.queryParams.subject,
        medium: bothParams.queryParams.medium,
        sector: bothParams.queryParams.gradeLevel,
        resourceType: bothParams.queryParams.resourceType,
        keywords: bothParams.queryParams.keywords,
        region: [],
        creators: [],
        language: [],
        organisation: [],
        channel: [this.userService.hashTagId],
        topic: [],
        country: [],
      },
      // limit: limit,
      // offset: (pageNumber - 1) * (limit),
      query: '' || bothParams.queryParams.query,
      // sort_by: this.sort
    };
    */
   const preStatus = ['Draft', 'Review', 'Live'];
   const searchParams = {
     filters: {
       status: bothParams.queryParams.status ? bothParams.queryParams.status : preStatus,
       createdBy: this.userService.userid,
       contentType: this.config.appConfig.WORKSPACE.contentType,
       objectType: this.config.appConfig.WORKSPACE.objectType,
       board: [],
       subject: bothParams.queryParams.subject,
       medium: bothParams.queryParams.medium,
       gradeLevel: bothParams.queryParams.gradeLevel,
       resourceType: bothParams.queryParams.resourceType,
       keywords: bothParams.queryParams.keywords,
       region: [],
       creators: [],
       languages: [],
       organisation: [],
       channel: [],
       topic: [],
       country: []
     },
     limit: limit,
     offset: (pageNumber - 1) * (limit),
     query: '' || bothParams.queryParams.query,
     sort_by: this.sort
   };
console.log('filter param = ', searchParams);
    this.paramType.forEach(param => {
        if (bothParams.queryParams.hasOwnProperty(param)) {
          if (param === 'board') {
            searchParams.filters.board.push(bothParams.queryParams[param][0]);
          }
          if (param === 'channel') {
            searchParams.filters.creators.push(bothParams.queryParams[param][0]);
            // searchParams.filters.channel.push(bothParams.queryParams[param][0]);
          }
          if (param === 'country') {
            searchParams.filters.region.push(bothParams.queryParams[param][0]);
          }
          if (param === 'gradeLevel') {
            searchParams.filters.gradeLevel.push(bothParams.queryParams[param][0]);
          }
          if (param === 'topic') {
            searchParams.filters.topic.push(bothParams.queryParams[param][0]);
          }
          if (param === 'languages') {
            searchParams.filters.languages.push(bothParams.queryParams[param][0]);
          }
          // if (param === 'country') {
          //   searchParams.filters.country = this.queryParams[param];
          // }

console.log('check query param = ', bothParams.queryParams[param][0], searchParams);
this.contentSearch(searchParams, pageNumber, limit);
    }
  });
  this.contentSearch(searchParams, pageNumber, limit);
  }
contentSearch(searchParams, pageNumber, limit) {
  this.orgDetailsUnsubscribe = this.searchContentWithLockStatus(searchParams)
      .subscribe(
        (data: ServerResponse) => {
          if (this.route.url === '/upForReview' ) {
            if (this.route.url === '/upForReview' ) {
               this.noResultsForReview = false;
               const option = {
                url : '/content/v1/search',
                param : '',
                filters: {
                  language: ['English'],
                  contentType: ['Resource'],
                  status: ['Review'],
                  channel: [this.userDetails.organisationIds[0], this.channelname],
                  organisation: this.config.appConfig.Library.orgName
              },
                sort_by: {me_averageRating: 'desc'}
              };
           //   delete option.sort_by;
           this.contentService.getupForReviewData(option).subscribe(response => {
             //   console.log(' res param in review page = ', option);
                if (response.result.count > 0) {
                  this.upForReviewContent = response.result.content.filter(content => content.createdBy !== this.userId);
                 // console.log('upfor review content = ', this.upForReviewContent, response);
                  if (this.upForReviewContent.length <= 0) {
                    this.noResultsForReview = true;
                    this.showLoader = false;
                    this.noResultMessage = {
                      'messageText': 'No assets available to review for now.'
                    };
                  } else {
                    // recieved some result
                    this.contentService.getMyassetPageData(this.upForReviewContent);
                    this.noResultsForReview = false;
                     this.showLoader = false;
                      this.noResult = false;
                  }

                  this.allContent = this.upForReviewContent;
           /*       this.allContent.forEach(element => {
                    console.log('assign state in review');
                    if (!localStorage.hasOwnProperty(element.identifier)) {
                      localStorage.setItem(element.identifier, JSON.stringify('Review'));
                    }
                  });
            */
                } else {
                  this.showLoader = false;
                  // set the no results template if no assets is present
                  this.noResultsForReview = true;
                  this.noResultMessage = {
                    'messageText': 'No assets available to review for now.'
                  };
                }
              });
            }
          } else {
            if (data.result.count && data.result.content.length > 0) {
              this.contentService.getMyassetPageData(data.result.content);
            this.allContent = data.result.content;
            console.log('Data in myasset', this.allContent);
              this.totalCount = data.result.count;
              let i;
              for (i = 0; i < this.totalCount; i++) {
                if (this.allContent[i]['status'] === 'Draft') {
                  const req = {
                    url: `${this.config.urlConFig.URLS.CONTENT.GET}/${this.allContent[i].identifier}`,
                  };
                  this.copied[this.allContent[i]['versionKey']] = false;
                  this.contentService.get(req).subscribe(data2 => {
                    this.copystate = data2.result.content.status;
                    if (this.copystate === 'Live') {
                      this.copied[data2.result.content.versionKey] = true;
                    } else {
                      this.copied[data2.result.content.versionKey] = true;
                    }
                  });
                } else {
                  this.copied[this.allContent[i]['versionKey']] = true;
                }
              }
          console.log('Copied content object', this.copied);
            this.pager = this.paginationService.getPager(data.result.count, pageNumber, limit);
            this.showLoader = false;
            this.noResult = false;
          } else {
            this.showError = false;
            this.noResult = true;
            this.showLoader = false;
            this.noResultMessage = {
              'messageText': this.resourceService.messages.stmsg.m0125
            };
          }
          }
        },
        (err: ServerResponse) => {
          this.showLoader = false;
          this.noResult = false;
          this.showError = true;
          this.toasterService.error(this.resourceService.messages.fmsg.m0081);
        }
      );
}
public deleteConfirmModal(contentIds) {
  this.deleteAsset = true;
  const config = new TemplateModalConfig<{ data: string }, string, string>(this.modalTemplate);
  config.isClosable = true;
  config.size = 'mini';
  config.context = {
    data: 'delete'
    };
    this.modalMessage = 'Do you want to delete this asset ?';

  this.modalService
    .open(config)
    .onApprove(result => {
      this.showLoader = true;
      this.loaderMessage = {
        'loaderMessage': this.resourceService.messages.stmsg.m0034,
      };
      this.delete(contentIds).subscribe(
        (data: ServerResponse) => {
          this.showLoader = false;
          this.allContent = this.removeAllMyContent(this.allContent, contentIds);
          if (this.allContent.length === 0) {
            this.ngOnInit();
          }
          this.toasterService.success('Asset deleted successfully');
        },
        (err: ServerResponse) => {
          this.showLoader = false;
          this.toasterService.error(this.resourceService.messages.fmsg.m0022);
        }
      );
    })
    .onDeny(result => {
    });
}
  public reviewConfirmModal(contentIds, status) {
    const config2 = new TemplateModalConfig<{ data: string }, string, string>(this.modalTemplate);
    config2.isClosable = true;
    config2.size = 'mini';
    config2.context = {
      data: 'Review'
      };
      this.modalMessage = 'Do you want to send this asset for review?';
    this.modalServices
      .open(config2)
      .onApprove(result => {
        this.showLoader = true;
        this.loaderMessage = {
          'loaderMessage': this.resourceService.messages.stmsg.m0034,
        };
        const requestBody = {
          request: {
            content: {
            }
          }
        };
        const req = {
          url: `${this.config.urlConFig.URLS.CONTENT.GET}/${contentIds}`,
        };
        this.contentService.get(req).subscribe(data => {
         this.mainState = data.result.content.status;
         if (this.mainState === 'Live') {
          localStorage.setItem('CopiedContent' + contentIds, 'Review');
        }
        });

        const option = {
           url: `${this.config.urlConFig.URLS.CONTENT.REVIEW}/${contentIds}`,
           data: requestBody
        };

        this.contentService.post(option).subscribe(
          (data: ServerResponse) => {
            console.log('data after sending for review = ', data);
            localStorage.setItem(contentIds, JSON.stringify('Review'));
            localStorage.setItem('creator', JSON.stringify(this.userId));
            const state = JSON.parse(localStorage.getItem(contentIds));
            const creatorId = JSON.parse(localStorage.getItem(contentIds));
            console.log('state = ', state, 'creator id = ', creatorId);

            this.toasterService.success('Your Asset has been sucessfully sent for review');
            setTimeout(() => {
              this.showLoader = false;
              this.ngOnInit();
            }, 2000);
          }, (err) => {
            this.showLoader = false;
            this.toasterService.error('An error occured while sending your asset for review.');
          });
      })

      .onDeny(result => {
      });
  }

  /**
   * This method helps to navigate to different pages.
   * If page number is less than 1 or page number is greater than total number
   * of pages is less which is not possible, then it returns.
	 *
	 * @param {number} page Variable to know which page has been clicked
	 *
	 * @example navigateToPage(1)
	 */
  navigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.route.navigate(['myassets/', this.pageNumber], { queryParams: this.queryParams });
  }
  navigateToDetailsPage(contentId: string, status: string, event, link) {
    console.log('event', event, link);

   if (event.target.id === 'link') {
     if ( link.slice(0, 4) === 'http') {
      window.open(link);
     } else {
      window.open('http://' + link);
     }
   } else {
    if (this.route.url === '/upForReview') {
      this.navigateToReviewAssetDetailsPage(contentId);
    } else {
      this.route.navigate(['myassets/detail', contentId, status]);
    }
  }
   }

  navigateToReviewAssetDetailsPage(contentId: string) {
    this.route.navigate(['upForReview/review/detail', contentId]);
  }

  contentClick(content) {
    if (_.size(content.lockInfo)) {
      this.lockPopupData = content;
      this.showLockedContentModal = true;
    } else {
      const status = content.status.toLowerCase();
      if (status === 'processing') {
        return;
      }
      if (status === 'draft') { // only draft state contents need to be locked
        this.workSpaceService.navigateToContent(content, this.state);
      } else {
        this.workSpaceService.navigateToContent(content, this.state);
      }
    }
  }

  public onCloseLockInfoPopup() {
    this.showLockedContentModal = false;
  }

  inview(event) {
    _.forEach(event.inview, (inview, key) => {
      const obj = _.find(this.inviewLogs, (o) => {
        return o.objid === inview.data.identifier;
      });
      if (obj === undefined) {
        this.inviewLogs.push({
          objid: inview.data.identifier,
          objtype: inview.data.contentType,
          index: inview.id
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inviewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  removeAllMyContent(contentList, requestData) {
    return contentList.filter((content) => {
      console.log('removed content = ', content);
      return requestData.indexOf(content.identifier) === -1;
    });
  }
  ngOnDestroy() {
    if (this.orgDetailsUnsubscribe) {
      this.orgDetailsUnsubscribe.unsubscribe();
    }
  }
  navigateToEditPage(contentId: string, status: string) {
    this.route.navigate(['myassets/update', contentId, status]);
  }
  /*telemetry implementation for space, function for getting route*/
  getRouteDetail(): string {
    let pageid;
    if (this.route.url === '/upForReview') {
      pageid = 'upforreview';
    } else {
      pageid = 'myassets';
    }
    return pageid;
  }
}
