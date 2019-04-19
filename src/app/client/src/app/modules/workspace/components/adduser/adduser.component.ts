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
    const valid = this.validate();
    if (valid) {
      const option = {
        url: this.configService.urlConFig.URLS.ADMIN.GET_ORG,
        data: {
          request: {
            organisationId: this.userService.rootOrgId
          }
        }
      };
      this.learnerService.post(option).subscribe(
        data => {
          const channel = data.result.response.channel;
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
          this.signupService.createUser1(option1).subscribe();
          this.toasterService.success('user created successfully');
          this.goBackToCoursePage();
        }, (err) => {
          this.toasterService.error(err);
          this.goBackToCoursePage();
        }
      );
    }
  }
  isDisabled(event) {
    this.enabled = !this.enabled;
  }
  validate(): boolean {
    if (this.name.status === 'VALID') {
      this.validdetails = true;
    } else {
      this.validdetails = false;
      this.toasterService.error('Name Required');
      return this.validdetails;
    }
    if (this.username.status === 'VALID') {
      this.validdetails = true;
    } else {
      this.validdetails = false;
      this.toasterService.error(' UserName Required');
      return this.validdetails;
    }
    if (this.password.status === 'VALID') {
      this.validdetails = true;
    } else {
      this.validdetails = false;
      this.toasterService.error(' Password Required');
      return this.validdetails;
    }
    if (this.enabled) {
      if (this.email.status === 'VALID') {
        this.validdetails = true;
      } else {
        this.validdetails = false;
        this.toasterService.error('Invalid email');
        return this.validdetails;
      }
    } else {
      if (this.phonenumber.status === 'VALID') {
        this.validdetails = true;
      } else {
        this.validdetails = false;
        this.toasterService.error(' Phone Number or email Required');
        return this.validdetails;
      }
    }
    if (this.cpassword.status === 'VALID') {
      if (this.password.value === this.cpassword.value) {
        this.validdetails = true;
      } else {
        this.validdetails = false;
        this.toasterService.error(
          'password should be same as above passoword '
        );
        return this.validdetails;
      }
    } else {
      this.validdetails = false;
      this.toasterService.error(' Confirm your password');
      return this.validdetails;
    }
    return this.validdetails;
  }
  goBackToCoursePage() {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
}
