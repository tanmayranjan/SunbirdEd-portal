import { Component, OnInit } from '@angular/core';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicDataService, LearnerService } from '@sunbird/core';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
// import { CourseBatchService } from '@sunbird/learn';
@Component({
  selector: 'app-preview-page',
  templateUrl: './preview-page.component.html',
  styleUrls: ['./preview-page.component.css']
})
export class PreviewPageComponent implements OnInit {
  // batchControl = new FormControl('', [Validators.required]);
  // batch: Batches[] = [
  //   {name: 'Ongoing', status: '1'},
  //   {name: 'Upcoming', status: '0'},
  //   {name: 'Previous', status: '2'},
  // ];
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
courseTitle;
courseDescription;
creator;
resourceType;
  courseInfo ;
  resources = [];
  showPreview: boolean;
firstPreviewUrl;
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
    public activatedRoute: ActivatedRoute
  ) {
    // this.collectionTreeOptions = this.config.appConfig.collectionTreeOptions;
  }

  ngOnInit() {
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

      if (data.result.content.hasOwnProperty('children')) {
        const childrenIds = data.result.content.children;

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

                } else {

                  if (value.hasOwnProperty('artifactUrl')) {
                  this.resources.push(value);

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

                } else if (value.hasOwnProperty('artifactUrl')) {
                  this.resources.push(value);

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


