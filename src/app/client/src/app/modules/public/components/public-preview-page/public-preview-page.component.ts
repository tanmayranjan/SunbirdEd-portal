import { Component, OnInit, Inject, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
// import { CourseConsumptionService, CourseBatchService } from '@sunbird/learn';
import { UserService, LearnerService, PublicDataService } from '@sunbird/core';
import { ConfigService, ToasterService, ICollectionTreeOptions} from '@sunbird/shared';
import { pluck } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

export interface Batches {
  name: string;
  status: string;
}
@Component({
  selector: 'app-public-preview-page',
  templateUrl: './public-preview-page.component.html',
  styleUrls: ['./public-preview-page.component.css']
})
export class PublicPreviewPageComponent implements OnInit {

  batchControl = new FormControl('', [Validators.required]);
  batch: Batches[] = [
    {name: 'Ongoing', status: '1'},
    {name: 'Upcoming', status: '0'},
    {name: 'Previous', status: '2'},
  ];
  courseId;
  courseDetails = [];
  public search: any;
  totalParticipants = 0;
  batches = [];
  mentorsDetails = [];
  previewurl = [];
  coursechapters = [];
  youtubelink = [];
  check = [];
  safeUrl;
  collectionTreeNodes;
  collectionTreeOptions: ICollectionTreeOptions;
courseTitle;
courseDescription;
creator;
resourceType;
  courseInfo ;
  resources = [];
  showPreview: boolean;
firstPreviewUrl;
userId;
  constructor(
    // public dialog: MatDialog,
    private route: ActivatedRoute,
    // private courseConsumptionService: CourseConsumptionService,
    // public courseBatchService: CourseBatchService,
    public learnerService: LearnerService,
    public config: ConfigService,
    public sanitizer: DomSanitizer,
    public router: Router,
    public toaster: ToasterService,
    public configService: ConfigService,
    public publicDataService: PublicDataService,
    public activatedRoute: ActivatedRoute,
    public userService: UserService
  ) {
    this.collectionTreeOptions = this.config.appConfig.collectionTreeOptions;
  }

  ngOnInit() {
    this.userId = this.userService.userid;
    this.search = {
      filters: {
        status: '1',
        courseId: this.courseId
      }
    };
        this.courseId = this.activatedRoute.snapshot.params.collectionId;

    this.getCourseDetails();
    // this.getBatchDetails(this.search);
  }
  // getCourseDetails() {
  //       const req = {
  //         url: `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${
  //           this.courseId
  //         }`
  //       };
  //   this.publicDataService.get(req).subscribe(data => {
  //               this.collectionTreeNodes = { data: data.result.content.children };
  //             this.coursechapters = data.result.content.children;

  //   });

    // this.courseConsumptionService.getCourseHierarchy(this.courseId)
    //   .subscribe(
    //     (response: any) => {
    //       this.courseDetails = response;
    //       console.log('course', this.courseDetails.createdBy);
    //       this.collectionTreeNodes = { data: this.courseDetails };
    //       this.coursechapters = this.courseDetails.children;
    //       // const mentorIds = _.union(this.courseDetails.createdBy);
    //       // console.log('mentor', mentorIds);
    //       // this.getMentorslist(mentorIds);
    //     },
    //     (err) => {
    //       this.toaster.error('Fetching Details Failed');
    //     },
    //     () => {
    //     }
    //   );
  // }
  getCourseDetails() {
    const req = {
      url: `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${
        this.courseId
      }`
    };
    this.publicDataService.get(req).subscribe(data => {
      this.courseInfo = data.result.content;
        console.log(data.result.content.appIcon);
console.log(this.courseInfo);
      if (data.result.content.hasOwnProperty('children')) {
        const childrenIds = data.result.content.children;
        console.log(data.result.content);
        this.creator = data.result.content.creator;
        this.courseTitle = data.result.content.name;
        this.resourceType = data.result.content.resourceType;
        this.courseDescription = data.result.content.description;
        _.forOwn(childrenIds, childrenvalue => {
          this.getChildren(childrenvalue);
        });
      }
    });
  }
  getChildren(sessiondetails) {
    // console.log(sessiondetails);
    _.forOwn(sessiondetails, (children, key) => {
      if (key === 'children') {
        _.forOwn(children, value => {
          if (key === 'children') {
            this.getChildren(value);
            if (value.hasOwnProperty('children')) {
              if (value.children.length === 0) {
                if (value.mimeType === 'video/x-youtube' || value.mimeType === 'video/mp4' || value.mimeType === 'application/pdf') {
                this.courseDetails.push(value);
                this.firstPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value.artifactUrl);
                if (this.firstPreviewUrl) {
                  this.showPreview = true;
                  this.safeUrl = this.firstPreviewUrl;

                }
                // console.log(this.courseDetails);
                } else {
                  console.log(value);
                  if (value.hasOwnProperty('artifactUrl')) {
                  this.resources.push(value);
                  // console.log(this.resources);
                  }
                }
              }
            } else if (value.hasOwnProperty('artifactUrl')) {
              if (value.mimeType === 'video/x-youtube' || value.mimeType === 'video/mp4'  || value.mimeType === 'application/pdf') {
                this.courseDetails.push(value);
                this.firstPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value.artifactUrl);
                if (this.firstPreviewUrl) {
                  this.showPreview = true;
                  this.safeUrl = this.firstPreviewUrl;

                }
                // console.log(this.courseDetails);
                } else if (value.hasOwnProperty('artifactUrl')) {
                  this.resources.push(value);
                  // console.log(this.resources);
                }
            }
          }
        });
      }
    });
  }
  public fetchUrl(session) {
    this.showPreview = true;
    console.log(session);
    let previewUrl;
    const url = session.artifactUrl.slice(17);
    if (session.mimeType === 'video/x-youtube') {
      console.log(_.includes(session.artifactUrl, 'watch'));
      if (_.includes(session.artifactUrl, 'watch')) {
        previewUrl = session.artifactUrl.replace('watch?v=', 'embed/');
        console.log(previewUrl);
      } else if (_.includes(session.artifactUrl, 'embed')) {
        previewUrl = session.artifactUrl;
      } else {
        previewUrl = 'https://www.youtube.com/embed/' + url;
        console.log(previewUrl);
      }
    } else {
      previewUrl = session.artifactUrl;
      console.log(previewUrl);
    }
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(previewUrl);

  }



  // getBatchDetails(search) {
  //   this.courseBatchService.getAllBatchDetails(search)
  //     .subscribe(
  //       (data: any) => {
  //       this.batches = data.result.response.content;
  //       for (const batch of this.batches) {
  //         if (batch.hasOwnProperty('participant')) {
  //           this.totalParticipants = this.totalParticipants + _.keys(batch.participant).length;
  //         }
  //       }
  //       if (this.batches.length > 0 && this.mentorsDetails.length === 0) {
  //         const mentorIds = _.union(this.batches[0].mentors);
  //         this.getMentorslist(mentorIds);
  //       }
  //     },
  //     (err) => {
  //       this.toaster.error('Fetching Details Failed');
  //     },
  //     );
  // }
  getMentorslist(mentorIds) {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          filters: {
            identifier : mentorIds,
          },
          limit: 2
        }
      }
    };
    this.learnerService.post(option)
      .subscribe(
        (data) => {
          this.mentorsDetails = data.result.response.content;
        },
        (err) => {
          this.toaster.error('Fetching Details Failed');
        }
      );
  }

  redirect() {
    this.router.navigate(['/learn/course', this.courseId]);
  }

  fetchBatches(input) {
    this.search = {
      filters: {
        status: input.status,
        courseId: this.courseId
      }
    };
    // this.getBatchDetails(this.search);
  }
}


