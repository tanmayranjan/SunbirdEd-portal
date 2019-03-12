import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.css']
})
export class CreateBatchComponent implements OnInit {
  @ViewChild('modal') modal;
  today = new Date();
  startDate = new FormControl(new Date().toISOString());
  endDate = new FormControl();
@Input() courseId;
name = new FormControl();
description = new FormControl();
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    console.log(this.courseId);
  }
createBatch() {
  // const requestBody = {
  //   courseId: this.courseId,
  //   name: this.batchnameCtrl.value,
  //   description: this.batchDescriptCtrl.value,
  //   // tslint:disable-next-line:quotemark
  //   enrollmentType: 'invite-only',
  //   startDate: startDate,
  //   endDate: endDate || null,
  //   createdBy: this.userService.userid,
  //   createdFor: this.userService.userProfile.organisationIds,
  //   mentors: _.compact(mentorIds)
  // };
}
goToCreate() {
  this.router.navigate(['/workspace/content/allcontent', 1]);
}
}
