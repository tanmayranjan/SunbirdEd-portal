import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { ConfigService, ToasterService } from '@sunbird/shared';
import {
  UserService,
  OrgDetailsService,
  PublicDataService,
  LearnerService
} from '@sunbird/core';
import { SignupService } from '../../../public/module/signup/services';
import { IUserData } from 'src/app/modules/shared';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  channel;
  email = new FormControl('', [Validators.email, Validators.required]);
  enableadduser = true;
  enabled = true;
  validdetails;
  route: Router;
  showbulkupload = false;
  singleUser = false;
  password = new FormControl('', [Validators.required]);
  cpassword = new FormControl('', [Validators.required]);
  username = new FormControl('', [Validators.required]);
  phonenumber = new FormControl('', [Validators.required]);
  name = new FormControl('', [Validators.required]);
  constructor(
    public configService: ConfigService,
    public userService: UserService,
    public orgDetailsService: OrgDetailsService,
    public signupService: SignupService,
    public publicdataservice: PublicDataService,
    public learnerService: LearnerService,
    public toasterService: ToasterService,
    route: Router
  ) {
    this.route = route;
  }

  ngOnInit() {}
  disableViewUser(event) {
    if (event.target.name === 'adduser') {
      this.enableadduser = true;
    } else {
      this.enableadduser = false;
    }
  }
  adduser(event) {
    if (event.target.name === 'bulk') {
      this.showbulkupload = !this.showbulkupload;
    }
    console.log('inside func', event.target.name);
  }
  addSingleUser() {
    this.singleUser = !this.singleUser;
  }
  submit() {
  let channel;
    this.userService.userData$.subscribe((user: IUserData) => {
     _.forEach(user.userProfile, (value, key) => {
       if (key === 'channel') {
        channel = value;
       }
     });
          });
          const option1 = {
            request: {
              firstName: this.name.value,
              userName: this.username.value,
              email: this.email.value,
              password: this.password.value,
              channel: channel,
              emailVerified: true
            }
          };
          this.signupService.createUser1(option1).subscribe(data => {
            this.toasterService.success('User Created Successfully');
            this.goBackToCoursePage();
          }, (err) => {
            console.log(err);
            this.toasterService.error(err.error.params.err);
          });

    }

  isDisabled(event) {
    this.enabled = !this.enabled;
  }

  goBackToCoursePage() {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
}
