import { combineLatest, Subject } from 'rxjs';
import { takeUntil, first, mergeMap, map } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { UserService, CoursesService
} from '@sunbird/core';
import { ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {
  ToasterService,
  ResourceService
} from '@sunbird/shared';
import {
  CourseConsumptionService,
  CourseBatchService,
  CourseProgressService
} from './../../../services';


@Component({
  selector: 'app-batch-card',
  templateUrl: './batch-card.component.html',
  styleUrls: ['./batch-card.component.css']
})
export class BatchCardComponent implements OnInit {
  unEnroll = false;
  @Input() batchDetails ;
  @Input() courseId;
  batchId;
  enrolledCourses = [];
  enrolledBatch;
  public unsubscribe = new Subject<void>();
  constructor(
    public route: Router,
    public courseBatchService: CourseBatchService,
    public userService: UserService,
    public coursesService: CoursesService,
    public toasterService: ToasterService,
    public resourceService: ResourceService
  ) {}

  ngOnInit() {
    console.log(this.batchDetails);
    this.fetchEnrolledCourses();
  }
  enrollToCourse(batch) {
    console.log(batch);
    const userId = this.userService.userid;
    if (!this.unEnroll) {
      const request = {
        request: {
          courseId: batch.courseId,
          batchId: batch.identifier,
          userId: userId
        }
      };
      this.courseBatchService
        .enrollToCourse(request)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          data => {
            this.toasterService.success(
              this.resourceService.messages.smsg.m0036
            );
          },
          err => {
            this.unEnroll = false;
            console.log(err);
              this.toasterService.error(err.error.params.err);
          }
        );
    }
  }
    fetchEnrolledCourses() {
      this.coursesService.getEnrolledCourses().pipe(
        takeUntil(this.unsubscribe))
        .subscribe((data: any) => {
          this.enrolledCourses = data.result.courses;
          console.log(this.enrolledCourses);
          console.log(this.courseId);
          for (const enrolledcourse of this.enrolledCourses) {
            if (this.courseId === enrolledcourse.courseId) {
             if ( this.batchDetails.identifier === enrolledcourse.batchId) {
              this.unEnroll = true;
              this.enrolledBatch = enrolledcourse.batchId;
             console.log(this.batchDetails.identifier, enrolledcourse.batchId);
             }
            }
          }
        }, (err) => {
          console.log(err);
          this.route.navigate(['/learn']);
        });
    }
}
