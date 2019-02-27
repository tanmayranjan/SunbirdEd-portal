// import { combineLatest, Subject } from 'rxjs';
// import { takeUntil, first, mergeMap, map } from 'rxjs/operators';
// import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
// import {
//   UserService,
//   BreadcrumbsService,
//   PermissionService,
//   CoursesService
// } from '@@sunbird/core';
// import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
// import * as _ from 'lodash';
// import {
//   WindowScrollService,
//   ILoaderMessage,
//   ConfigService,
//   ICollectionTreeOptions,
//   NavigationHelperService,
//   ToasterService,
//   ResourceService,
//   ExternalUrlPreviewService
// } from '@@sunbird/shared';
// import {
//   CourseConsumptionService,
//   CourseBatchService,
//   CourseProgressService
// } from './../../../services';
// import { INoteData } from '@@sunbird/notes';
// import {
//   IImpressionEventInput,
//   IEndEventInput,
//   IStartEventInput,
//   IInteractEventObject,
//   IInteractEventEdata
// } from '@@sunbird/telemetry';
// import { DeviceDetectorService } from 'ngx-device-detector';
// // import { Component, OnInit } from '@angular/core';
// // import { ConfigService } from '@@sunbird/shared';
// // import { ActivatedRoute, Router } from '@angular/router';
// import { PublicDataService, LearnerService } from '@@sunbird/core';
// // import * as _ from 'lodash';
// import { DomSanitizer } from '@angular/platform-browser';

// @Component({
//   selector: 'app-course-player',
//   templateUrl: './course-player.component.html',
//   styleUrls: ['./course-player.component.css']
// })
// export class CoursePlayerComponent implements OnInit {
//   courseId;
//   batchId;
//   courseDetails = [];
//   safeUrl;
//   resources = [];
//   creator;
//   batchDetails = [];
//   enrolledCourses = [];
//   courseDescription;
//   unEnroll = false;
//   showPromo = true;
//   userRoles = false;
//   courseTitle;
//   userEnrolledBatch = false;
//   creatorFor = [];
//   courseIds = [];




//   public courseInteractObject: IInteractEventObject;

//   public contentInteractObject: IInteractEventObject;

//   public closeContentIntractEdata: IInteractEventEdata;



//   public enrolledCourse = false;


//   public courseStatus: string;

//   public flaggedCourse = false;

//   public collectionTreeNodes: any;

//   public contentTitle: string;

//   public playerConfig: any;

//   public loader = true;

//   public showError = false;

//   public enableContentPlayer = false;

//   public courseHierarchy: any;

//   public readMore = false;

//   public createNoteData: INoteData;

//   public curriculum = [];

//   public istrustedClickXurl = false;

//   public showNoteEditor = false;

//   public telemetryCourseImpression: IImpressionEventInput;

//   public telemetryContentImpression: IImpressionEventInput;

//   public telemetryCourseEndEvent: IEndEventInput;

//   public telemetryCourseStart: IStartEventInput;


//   public unsubscribe = new Subject<void>();
//   public courseProgressData: any;

//   public contentStatus: any;

//   public contentDetails = [];

//   public enrolledBatchInfo: any;

//   public treeModel: any;

//   public nextPlaylistItem: any;

//   public prevPlaylistItem: any;

//   public contributions: any;

//   public noContentToPlay = 'No content to play';

//   public showExtContentMsg = false;

//   public loaderMessage: ILoaderMessage = {
//     headerMessage: 'Please wait...',
//     loaderMessage: 'Fetching content details!'
//   };

//   public previewContentRoles = ['COURSE_MENTOR', 'CONTENT_REVIEWER', 'CONTENT_CREATOR', 'CONTENT_CREATION'];

//   public collectionTreeOptions: ICollectionTreeOptions;

//   constructor(
//     public activatedRoute: ActivatedRoute,
//     public configService: ConfigService,
//     public publicDataService: PublicDataService,
//     public learnerService: LearnerService,
//     public sanitizer: DomSanitizer,
//     public route: Router,
//     public courseBatchService: CourseBatchService,
//     public userService: UserService,
//     public coursesService: CoursesService,
//     public toasterService: ToasterService,
//     public resourceService: ResourceService,
//     private courseConsumptionService: CourseConsumptionService,
//  public windowScrollService: WindowScrollService,
//     public router: Router, public navigationHelperService: NavigationHelperService,
//  public breadcrumbsService: BreadcrumbsService,
//     private cdr: ChangeDetectorRef,  public permissionService: PermissionService,
//     public externalUrlPreviewService: ExternalUrlPreviewService,
//     private courseProgressService: CourseProgressService, private deviceDetectorService: DeviceDetectorService
//   ) {
//     this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
//   }

//   ngOnInit() {
//     this.courseId = this.activatedRoute.snapshot.params.courseId;
//     this.batchId = this.activatedRoute.snapshot.params.batchId;
//     this.getCourseDetails();
//     this.userEnrolledBatch = _.includes(this.activatedRoute.snapshot.params, this.batchId);
//   }

//   getCourseDetails() {
//     const req = {
//       url: `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${
//         this.courseId
//       }`
//     };
//     this.publicDataService.get(req).subscribe(data => {
//       console.log(data);
//       if (data.result.content.hasOwnProperty('children')) {
//         const childrenIds = data.result.content.children;
//         console.log(data.result.content);
//         // this.courseIds = childrenIds;
//         this.courseTitle = data.result.content.name;
//         this.creator = data.result.content.creator;
//         this.creatorFor = data.result.content.createdFor;
//         console.log(this.creatorFor);
//         this.courseDescription = data.result.content.description;
//         _.forOwn(childrenIds, childrenvalue => {
//           console.log(childrenvalue.identifier);
//           this.courseIds.push(childrenvalue.identifier);
//           this.getChildren(childrenvalue);
//         });
//       }
//     });
//   }
//   getChildren(sessiondetails) {
//     _.forOwn(sessiondetails, (children, key) => {
//       if (key === 'children') {
//         _.forOwn(children, value => {
//           if (key === 'children') {
//             this.getChildren(value);
//             if (value.hasOwnProperty('children')) {
//               if (value.children.length === 0) {
//                 if (
//                   value.mimeType === 'video/x-youtube' ||
//                   value.mimeType === 'video/mp4' ||
//                   value.mimeType === 'application/pdf'
//                 ) {
//                   console.log(value.identifier);
//                   // this.courseIds.push(value.identifier);
//                   this.courseDetails.push(value);
//                 } else {
//                   this.resources.push(value);
//                   // this.courseIds.push(value.identifier);
//                 }
//               }
//             } else if (value.hasOwnProperty('artifactUrl')) {
//               if (
//                 value.mimeType === 'video/x-youtube' ||
//                 value.mimeType === 'video/mp4' ||
//                 value.mimeType === 'application/pdf'
//               ) {
//                 // console.log(value.identifier);
//                 // this.courseIds.push(value.identifier);
//                 this.courseDetails.push(value);
//               } else {
//                 this.resources.push(value);
//                 // this.courseIds.push(value.identifier);

//               }
//             }
//           }
//         });
//       }
//     });
//   }
//   public fetchUrl(session) {
//     console.log(session);
//     this.getContentState();
//     this.showPromo = false;
//     let previewUrl;
//     const url = session.artifactUrl.slice(17);
//     if (session.mimeType === 'video/x-youtube') {
//       if (_.includes(session.artifactUrl, 'watch')) {
//         previewUrl = session.artifactUrl.replace('watch?v=', 'embed/');
//       } else {
//         previewUrl = 'https://www.youtube.com/embed/' + url;
//       }
//     } else {
//       previewUrl = session.artifactUrl;
//     }
//     this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(previewUrl);
//   }

//   getBatchDetails() {

//     this.userRoles = false;
//     const batches = {
//       filters: {
//         courseId: this.courseId
//       }
//     };
//     this.courseBatchService.getAllBatchDetails(batches).subscribe(batchData => {
//       console.log(batchData.result.response);
//       _.forOwn(batchData.result.response.content, batchdetails => {
//         this.batchDetails.push(batchdetails);
//         if (batchData.result.response.content.length < 0) {
//           this.toasterService.error('sorry no batches for this course');
//         }
//       });
//     });
//    }
// private getContentState() {
//     const req = {
//       userId: this.userService.userid,
//       courseId: this.courseId,
//       courseIds: this.courseIds,
//       batchId: this.batchId
//     };
//     console.log(req);
//     this.courseProgressService.courseProgressData
//       .pipe(takeUntil(this.unsubscribe))
//       .subscribe(courseProgressData => {
//         console.log(courseProgressData);
//         this.courseProgressData = courseProgressData;

//       });
//   }
//     public contentProgressEvent(event) {
//     if (!this.batchId || _.get(this.enrolledBatchInfo, 'status') !== 1) {
//       return;
//     }
//     const eid = event.detail.telemetryData.eid;

//     const request: any = {
//       userId: this.userService.userid,
//       courseId: this.courseId,
//       batchId: this.batchId,
//       status: eid === 'END' ? 2 : 1
//     };
//     this.courseConsumptionService.updateContentsState(request).pipe(first())
//     .subscribe(updatedRes => this.contentStatus = updatedRes.content,
//       err => console.log('updating content status failed', err));
//   }
// }


import { combineLatest, Subject } from 'rxjs';
import { takeUntil, first, mergeMap, map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UserService, BreadcrumbsService, PermissionService, CoursesService } from '@sunbird/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import {
  WindowScrollService, ILoaderMessage, ConfigService, ICollectionTreeOptions, NavigationHelperService,
  ToasterService, ResourceService, ExternalUrlPreviewService
} from '@sunbird/shared';
import { CourseConsumptionService, CourseBatchService, CourseProgressService } from './../../../services';
import { INoteData } from '@sunbird/notes';
import { IImpressionEventInput, IEndEventInput, IStartEventInput, IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PublicDataService, LearnerService } from '@sunbird/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-course-player',
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css']
})
export class CoursePlayerComponent implements OnInit, OnDestroy {

  courseDetails = [];
  safeUrl;
  resources = [];
  creator;
  batchDetails = [];
  enrolledCourses = [];
  courseDescription;
  unEnroll = false;
  showPromo = true;
  userRoles = false;
  courseTitle;
  userEnrolledBatch = false;
  creatorFor = [];
  courseIds = [];

  public courseInteractObject: IInteractEventObject;

  public contentInteractObject: IInteractEventObject;

  public closeContentIntractEdata: IInteractEventEdata;

  private courseId: string;

  public batchId: string;

  public enrolledCourse = false;

  public contentId: string;

  public courseStatus: string;

  public flaggedCourse = false;

  public collectionTreeNodes: any;

  public contentTitle: string;

  public playerConfig: any;

  public loader = true;

  public showError = false;

  public enableContentPlayer = false;

  public courseHierarchy: any;

  public readMore = false;

  public createNoteData: INoteData;

  public curriculum = [];

  public istrustedClickXurl = false;

  public showNoteEditor = false;

  public telemetryCourseImpression: IImpressionEventInput;

  public telemetryContentImpression: IImpressionEventInput;

  public telemetryCourseEndEvent: IEndEventInput;

  public telemetryCourseStart: IStartEventInput;

  public contentIds = [];

  public courseProgressData: any;

  public contentStatus: any;

  public contentDetails = [];

  public enrolledBatchInfo: any;

  public treeModel: any;

  public nextPlaylistItem: any;

  public prevPlaylistItem: any;

  public contributions: any;

  public noContentToPlay = 'No content to play';

  public showExtContentMsg = false;

  public loaderMessage: ILoaderMessage = {
    headerMessage: 'Please wait...',
    loaderMessage: 'Fetching content details!'
  };

  public previewContentRoles = ['COURSE_MENTOR', 'CONTENT_REVIEWER', 'CONTENT_CREATOR', 'CONTENT_CREATION'];

  public collectionTreeOptions: ICollectionTreeOptions;

  public unsubscribe = new Subject<void>();

  constructor(public activatedRoute: ActivatedRoute, private configService: ConfigService,
    private courseConsumptionService: CourseConsumptionService, public windowScrollService: WindowScrollService,
    public router: Router, public navigationHelperService: NavigationHelperService, private userService: UserService,
    private toasterService: ToasterService, private resourceService: ResourceService, public breadcrumbsService: BreadcrumbsService,
    private cdr: ChangeDetectorRef, public courseBatchService: CourseBatchService, public permissionService: PermissionService,
    public externalUrlPreviewService: ExternalUrlPreviewService, public coursesService: CoursesService,
    private courseProgressService: CourseProgressService, private deviceDetectorService: DeviceDetectorService,
 public publicDataService: PublicDataService,
        public learnerService: LearnerService,
        public sanitizer: DomSanitizer,
        public route: Router) {
    this.router.onSameUrlNavigation = 'ignore';
    this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
  }
  ngOnInit() {
    // this.courseId = this.activatedRoute.snapshot.params.courseId;
    // this.batchId = this.activatedRoute.snapshot.params.batchId;
    this.userEnrolledBatch = _.includes(this.activatedRoute.snapshot.params, this.batchId);
    // this.getCourseDetails();
    this.activatedRoute.params.pipe(first(),
      mergeMap(({courseId, batchId, courseStatus}) => {
        this.courseId = courseId;
        this.batchId = batchId;
        this.courseStatus = courseStatus;
        this.setTelemetryCourseImpression();
        const inputParams = {params: this.configService.appConfig.CourseConsumption.contentApiQueryParams};
        if (this.batchId) {
          console.log('con', this.courseConsumptionService.getCourseHierarchy(courseId, inputParams));
          return combineLatest(
            this.courseConsumptionService.getCourseHierarchy(courseId, inputParams),
            this.courseBatchService.getEnrolledBatchDetails(this.batchId),
          ).pipe(map(results => ({ courseHierarchy: results[0], enrolledBatchDetails: results[1] })));
        }
        return this.courseConsumptionService.getCourseHierarchy(courseId, inputParams)
          .pipe(map(courseHierarchy => ({ courseHierarchy })));
      })).subscribe(({courseHierarchy, enrolledBatchDetails}: any) => {
        console.log('heir', this.courseHierarchy);
        this.courseHierarchy = courseHierarchy;
        this.contributions = _.join(_.map(this.courseHierarchy.contentCredits, 'name'));
        this.courseInteractObject = {
          id: this.courseHierarchy.identifier,
          type: 'Course',
          ver: this.courseHierarchy.pkgVersion ? this.courseHierarchy.pkgVersion.toString() : '1.0'
        };
        if (this.courseHierarchy.status === 'Flagged') {
          this.flaggedCourse = true;
        }
        this.parseChildContent();
        if (this.batchId) {
          this.enrolledBatchInfo = enrolledBatchDetails;
          this.enrolledCourse = true;
          this.setTelemetryStartEndData();
          if (this.enrolledBatchInfo.status && this.contentIds.length) {
            this.getContentState();
            this.subscribeToQueryParam();
          }
        } else if (this.courseStatus === 'Unlisted' || this.permissionService.checkRolesPermissions(this.previewContentRoles)
          || this.courseHierarchy.createdBy === this.userService.userid) {
          this.subscribeToQueryParam();
        }
        this.collectionTreeNodes = { data: this.courseHierarchy };
        this.loader = false;
      }, (error) => {
        this.loader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0005); // need to change message
    });
    this.courseProgressService.courseProgressData.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(courseProgressData => this.courseProgressData = courseProgressData);
      console.log('heir', this.courseHierarchy);

  }


  getCourseDetails() {
    const req = {
      url: `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${
        this.courseId
      }`
    };
    this.publicDataService.get(req).subscribe(data => {
      console.log(data);
      if (data.result.content.hasOwnProperty('children')) {
        const childrenIds = data.result.content.children;
        console.log(data.result.content);
        // this.courseIds = childrenIds;
        this.courseTitle = data.result.content.name;
        this.creator = data.result.content.creator;
        this.creatorFor = data.result.content.createdFor;
        console.log(this.creatorFor);
        this.courseDescription = data.result.content.description;
        _.forOwn(childrenIds, childrenvalue => {
          console.log(childrenvalue.identifier);
          this.courseIds.push(childrenvalue.identifier);
          this.getChildren(childrenvalue);
        });
      }
    });
  }
  getChildren(sessiondetails) {
    _.forOwn(sessiondetails, (children, key) => {
      if (key === 'children') {
        _.forOwn(children, value => {
          if (key === 'children') {
            this.getChildren(value);
            if (value.hasOwnProperty('children')) {
              if (value.children.length === 0) {
                if (
                  value.mimeType === 'video/x-youtube' ||
                  value.mimeType === 'video/mp4' ||
                  value.mimeType === 'application/pdf'
                ) {
                  console.log(value.identifier);
                  // this.courseIds.push(value.identifier);
                  this.courseDetails.push(value);
                } else {
                  this.resources.push(value);
                  // this.courseIds.push(value.identifier);
                }
              }
            } else if (value.hasOwnProperty('artifactUrl')) {
              if (
                value.mimeType === 'video/x-youtube' ||
                value.mimeType === 'video/mp4' ||
                value.mimeType === 'application/pdf'
              ) {
                // console.log(value.identifier);
                // this.courseIds.push(value.identifier);
                this.courseDetails.push(value);
              } else {
                this.resources.push(value);
                // this.courseIds.push(value.identifier);

              }
            }
          }
        });
      }
    });
  }
  public fetchUrl(session) {
    console.log(session);
    this.getContentState();
    this.showPromo = false;
    let previewUrl;
    const url = session.artifactUrl.slice(17);
    if (session.mimeType === 'video/x-youtube') {
      if (_.includes(session.artifactUrl, 'watch')) {
        previewUrl = session.artifactUrl.replace('watch?v=', 'embed/');
      } else {
        previewUrl = 'https://www.youtube.com/embed/' + url;
      }
    } else {
      previewUrl = session.artifactUrl;
    }
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(previewUrl);
  }

  getBatchDetails() {

    this.userRoles = false;
    const batches = {
      filters: {
        courseId: this.courseId
      }
    };
    this.courseBatchService.getAllBatchDetails(batches).subscribe(batchData => {
      console.log(batchData.result.response);
      _.forOwn(batchData.result.response.content, batchdetails => {
        this.batchDetails.push(batchdetails);
        if (batchData.result.response.content.length < 0) {
          this.toasterService.error('sorry no batches for this course');
        }
      });
    });
   }


  private parseChildContent() {
    const model = new TreeModel();
    const mimeTypeCount = {};
    this.treeModel = model.parse(this.courseHierarchy);
    this.treeModel.walk((node) => {
      if (node.model.mimeType !== 'application/vnd.ekstep.content-collection') {
        if (mimeTypeCount[node.model.mimeType]) {
          mimeTypeCount[node.model.mimeType] += 1;
        } else {
          mimeTypeCount[node.model.mimeType] = 1;
        }
        this.contentDetails.push({ id: node.model.identifier, title: node.model.name });
        this.contentIds.push(node.model.identifier);
      }
    });
    _.forEach(mimeTypeCount, (value, key) => {
      this.curriculum.push({ mimeType: key, count: value });
    });
  }
  private getContentState() {
    const req = {
      userId: this.userService.userid,
      courseId: this.courseId,
      contentIds: this.contentIds,
      batchId: this.batchId
    };
    this.courseConsumptionService.getContentState(req).pipe(first())
      .subscribe(res =>  {
        console.log(res);
        this.contentStatus = res.content;
        console.log(res.content);
      },
        err => console.log(err, 'content read api failed'));
  }
  private subscribeToQueryParam() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe))
    .subscribe(({contentId}) => {
      if (contentId) {
        const content = this.findContentById(contentId);
        const isExtContentMsg = this.coursesService.showExtContentMsg ? this.coursesService.showExtContentMsg : false;
        if (content) {
          this.OnPlayContent({ title: _.get(content, 'model.name'), id: _.get(content, 'model.identifier') },
            isExtContentMsg);
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0005); // need to change message
          this.closeContentPlayer();
        }
      } else {
        this.closeContentPlayer();
      }
    });
  }
  public findContentById(id: string) {
    return this.treeModel.first(node => node.model.identifier === id);
  }
  private OnPlayContent(content: { title: string, id: string }, showExtContentMsg?: boolean) {
    console.log('called firstr');
    if (content && content.id && ((this.enrolledCourse && !this.flaggedCourse &&
      this.enrolledBatchInfo.status > 0) || this.courseStatus === 'Unlisted'
      || this.permissionService.checkRolesPermissions(this.previewContentRoles)
      || this.courseHierarchy.createdBy === this.userService.userid)) {
      this.contentId = content.id;
      this.setTelemetryContentImpression();
      this.setContentNavigators();
      this.playContent(content, showExtContentMsg);
    } else {
      this.closeContentPlayer();
    }
  }
  private setContentNavigators() {
    const index = _.findIndex(this.contentDetails, ['id', this.contentId]);
    this.prevPlaylistItem = this.contentDetails[index - 1];
    this.nextPlaylistItem = this.contentDetails[index + 1];
  }
  private playContent(data: any, showExtContentMsg?: boolean): void {
    console.log('called second');
    this.enableContentPlayer = false;
    this.loader = true;
    const options: any = { courseId: this.courseId };
    if (this.batchId) {
      options.batchHashTagId = this.enrolledBatchInfo.hashTagId;
    }
    this.courseConsumptionService.getConfigByContent(data.id, options).pipe(first())
      .subscribe(config => {
        this.setContentInteractData(config);
        this.loader = false;
        this.playerConfig = config;
        if ((config.metadata.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl && !(this.istrustedClickXurl))
          || (config.metadata.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl && showExtContentMsg)) {
          setTimeout(() => this.showExtContentMsg = true, 5000);
        } else {
          this.showExtContentMsg = false;
        }
        console.log('sub bef', this.enableContentPlayer);
        this.enableContentPlayer = true;
        console.log('sub aft', this.enableContentPlayer);
        this.contentTitle = data.title;
        this.breadcrumbsService.setBreadcrumbs([{ label: this.contentTitle, url: '' }]);
        this.windowScrollService.smoothScroll('app-player-collection-renderer', 500);
      }, (err) => {
        this.loader = false;
        this.toasterService.error(this.resourceService.messages.stmsg.m0009);
      });
      console.log('palyer', this.enableContentPlayer);
  }
  public navigateToContent(content: { title: string, id: string }): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'contentId': content.id },
      relativeTo: this.activatedRoute
    };
    const playContentDetail = this.findContentById(content.id);
    if (playContentDetail.model.mimeType === this.configService.appConfig.PLAYER_CONFIG.MIME_TYPE.xUrl) {
      this.showExtContentMsg = false;
      this.istrustedClickXurl = true;
      this.externalUrlPreviewService.generateRedirectUrl(playContentDetail.model, this.userService.userid, this.courseId, this.batchId);
    }
    if ((this.batchId && !this.flaggedCourse && this.enrolledBatchInfo.status)
      || this.courseStatus === 'Unlisted' || this.permissionService.checkRolesPermissions(this.previewContentRoles)
      || this.courseHierarchy.createdBy === this.userService.userid) {
      this.router.navigate([], navigationExtras);
    }
  }
  public contentProgressEvent(event) {
    if (!this.batchId || _.get(this.enrolledBatchInfo, 'status') !== 1) {
      return;
    }
    const eid = event.detail.telemetryData.eid;
    if (eid === 'END' && !this.validEndEvent(event)) {
      return;
    }
    const request: any = {
      userId: this.userService.userid,
      contentId: this.contentId,
      courseId: this.courseId,
      batchId: this.batchId,
      status: eid === 'END' ? 2 : 1
    };
    this.courseConsumptionService.updateContentsState(request).pipe(first())
    .subscribe(updatedRes => this.contentStatus = updatedRes.content,
      err => console.log('updating content status failed', err));
  }
  private validEndEvent(event) {
    const playerSummary: Array<any> = _.get(event, 'detail.telemetryData.edata.summary');
    const contentMimeType = _.get(this.findContentById(this.contentId), 'model.mimeType');
    const validSummary = (summaryList: Array<any>) => (percentage: number) => _.find(summaryList, (requiredProgress =>
      summary => summary && summary.progress >= requiredProgress)(percentage));
    if (validSummary(playerSummary)(20) && ['video/x-youtube', 'video/mp4', 'video/webm'].includes(contentMimeType)) {
        return true;
    } else if (validSummary(playerSummary)(0) &&
        ['application/vnd.ekstep.h5p-archive', 'application/vnd.ekstep.html-archive'].includes(contentMimeType)) {
      return true;
    } else if (validSummary(playerSummary)(100)) {
      return true;
    }
    return false;
  }
  public closeContentPlayer() {
    console.log('bef if', this.enableContentPlayer);
    this.cdr.detectChanges();
    if (this.enableContentPlayer === true) {
      console.log('aft if', this.enableContentPlayer);

      const navigationExtras: NavigationExtras = {
        relativeTo: this.activatedRoute
      };
      this.enableContentPlayer = false;
      this.router.navigate([], navigationExtras);
    }
  }
  public createEventEmitter(data) {
    this.createNoteData = data;
  }
  ngOnDestroy() {
    console.log('at last');
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.closeContentPlayer();
  }
  private setTelemetryStartEndData() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    this.telemetryCourseStart = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.courseId,
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver,
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: 'play',
        uaspec: {
          agent: deviceInfo.browser,
          ver: deviceInfo.browser_version,
          system: deviceInfo.os_version ,
          platform: deviceInfo.os,
          raw: deviceInfo.userAgent
        }
      }
    };
    this.telemetryCourseEndEvent = {
      object: {
        id: this.courseId,
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
        ver: this.activatedRoute.snapshot.data.telemetry.object.ver
      },
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: 'play'
      }
    };
  }
  private setTelemetryCourseImpression() {
    this.telemetryCourseImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
      },
      object: {
        id: this.courseId,
        type: 'course',
        ver: '1.0'
      }
    };
  }
  private setTelemetryContentImpression() {
    this.telemetryContentImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
      },
      object: {
        id: this.contentId,
        type: 'content',
        ver: '1.0',
        rollup: {
          l1: this.courseId,
          l2: this.contentId
        }
      }
    };
  }
  private setContentInteractData(config) {
    this.contentInteractObject = {
      id: config.metadata.identifier,
      type: config.metadata.contentType || config.metadata.resourceType || 'content',
      ver: config.metadata.pkgVersion ? config.metadata.pkgVersion.toString() : '1.0',
      rollup: { l1: this.courseId }
    };
    this.closeContentIntractEdata = {
      id: 'content-close',
      type: 'click',
      pageid: 'course-consumption'
    };
  }
}
