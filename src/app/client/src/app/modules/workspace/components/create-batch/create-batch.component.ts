import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { UserService, LearnerService} from '@sunbird/core';
import { CourseBatchService} from '@sunbird/learn';
import {combineLatest as observableCombineLatest, Subject, of as observableOf, Observable } from 'rxjs';

import { Inject } from '@angular/core';
import {
  ConfigService,
  ToasterService,
  ServerResponse,
  ResourceService
} from '@sunbird/shared';

import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.css']
})
export class CreateBatchComponent implements OnInit {
  @ViewChild('modal') modal;
  today = new Date();
  public unsubscribe = new Subject<void>();
  courseId;
  startDate;
  endDate;
  allMembers = [];
  allMentors = [];
  addedMentors = [];
  addedMembers = [];
  enableSubmitbtn = false;
  enabled = true;
  queryParams: any;
name = new FormControl('', Validators.required);
open = new FormControl('', Validators.required);
invite = new FormControl('', Validators.required);
description = new FormControl('', Validators.required);
pageNumber = 1;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    public courseBatchService: CourseBatchService,
    public userService: UserService,
    rout: Router,
    public resourceService: ResourceService,
    public toasterService: ToasterService,
    public learnerService: LearnerService,
    public config: ConfigService,
  ) { }

  ngOnInit() {
   this.activatedRoute.params.subscribe(data => {
    this.courseId = data.courseId;
   });
   this.getMemberslist();
   this.getMentorslist();
    console.log(this.courseId);
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
      });
  }


createBatch(startDate, endDate) {
  let enrollmentType;
 if (!this.enabled) {
enrollmentType = 'open';
 } else {
   enrollmentType = 'invite-only';
 }
  this.startDate = new Date(Date.parse(startDate)).toISOString().slice(0, 10);
  this.endDate = new Date(Date.parse(endDate)).toISOString().slice(0, 10);
  const requestBody = {
    courseId: this.courseId,
    name: this.name.value,
    description: this.description.value,
    enrollmentType: enrollmentType,
    startDate: this.startDate,
    endDate: this.endDate || null,
    createdBy: this.userService.userid,
    createdFor: this.userService.userProfile.organisationIds,
    mentors: _.compact(this.addedMentors)
  };
  console.log(requestBody);
const participants = this.addedMembers;
console.log(participants);
  this.courseBatchService
    .createBatch(requestBody)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      response => {
        console.log(response);
        if (participants && participants.length > 0) {
          this.addParticipantToBatch(response.result.batchId, participants);
        } else {
          this.enableSubmitbtn = true;
          this.toasterService.success(
           'Batch created successfully'
          );
        }
      },
      (err) => {
        console.log(err);
        console.log(err.error.params.err);
        if (err.error.params.err !== 'ENROLLEMENT_TYPE_VALIDATION' && err.error.params.err !== null) {
          this.toasterService.error(err.error.params.errmsg);

        } else {
          this.toasterService.success('Batch Created Successfully');
        }

});

}

private addParticipantToBatch(batchId, participants) {
  const userRequest = {
    userIds: _.compact(participants)
  };
  this.courseBatchService
    .addUsersToBatch(userRequest, batchId)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(res => {
      console.log(res);
      this.enableSubmitbtn = true;
      this.toasterService.success(this.resourceService.messages.smsg.m0033);
    }, (err) => {

      console.log(err.error.params.err);
      if (err.error.params.err !== 'ENROLLEMENT_TYPE_VALIDATION' && err.error.params.err !== null) {
        this.toasterService.error(err.error.params.errmsg);
      } else {
        this.toasterService.success('Batch Created Successfully');
      }
    });
}

      getMemberslist() {
      setTimeout(() => {
  const option = {
    url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
    data: {
      request: {
        query: '',
        filters: {
          rootOrgId: this.userService.rootOrgId
        }
      }
    }
  };
  this.learnerService.post(option).subscribe(
    data => {
      console.log(data);
      const membersDetails = data.result.response.content;
_.forOwn(membersDetails, membersDetail => {
 const obj = {};
 obj['id'] = membersDetail.identifier;
 obj['name'] = membersDetail.firstName;
 this.allMembers.push(obj);
});
console.log(this.allMembers);
          // this.allMembers = this.allMembers.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));
    },
    err => {
      this.toasterService.error(err.error.params.errmsg);
    }
  );
}, 0);
      }

      getMentorslist() {
       setTimeout(() => {
        const option = {
          url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
          data: {
            request: {
              query: 'COURSE_MENTOR',
              filters: {
                rootOrgId: this.userService.rootOrgId
              }
            }
          }
        };
        this.learnerService.post(option).subscribe(
          data => {
            const membersDetails = data.result.response.content;
  _.forOwn(membersDetails, membersDetail => {
    console.log(membersDetail);
    const obj = {};
    obj['id'] = membersDetail.identifier;
    obj['name'] = membersDetail.firstName;
    this.allMentors.push(obj);
  });
  console.log(this.allMembers);
// this.allMentors = this.allMentors.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));
          },
          err => {
            this.toasterService.error(err.error.params.errmsg);
          }
        );
       }, 0);
      }

goToCreate() {
  this.router.navigate(['workspace/content/allcontent', this.pageNumber], { queryParams: this.queryParams });
}
onSelectMentor(mentor) {
  console.log(mentor);
  this.addedMentors.push(mentor.id);
  console.log(this.addedMentors);
}
onSelectMember(member) {
  console.log(member);
  this.addedMembers.push(member.id);
  console.log(this.addedMembers);
}
isDisabled(event) {
console.log(event.target.value);
if (event.target.value === 'open') {
this.enabled = false;
} else {
  this.enabled = true;
}
console.log(this.enabled);

}
}
