import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { ConfigService, ToasterService } from '@sunbird/shared';
import {
  UserService,
  OrgDetailsService,
  LearnerService,
  PublicDataService,
} from '@sunbird/core';
import { SignupService } from '../../../public/module/signup/services';
import { Subscription } from 'rxjs';
import { IUserData, IUserProfile, NavigationHelperService } from '@sunbird/shared';
import { IImpressionEventInput } from '@sunbird/telemetry';

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
  userroles = [];
  singleUser = false;
  password = new FormControl('', [Validators.required]);
  cpassword = new FormControl('', [Validators.required]);
  username = new FormControl('', [Validators.required]);
  phonenumber = new FormControl('', [Validators.required]);
  name = new FormControl('', [Validators.required]);
  userId: any;
  success = false;
  orgId: any;
  userDataSubscription: Subscription;
 userProfile: IUserProfile;
 telemetryImpression: IImpressionEventInput;
  constructor(
    public configService: ConfigService,
    public userService: UserService,
    public orgDetailsService: OrgDetailsService,
    public signupService: SignupService,
    public publicdataservice: PublicDataService,
    public toasterService: ToasterService,
    public learnerService: LearnerService,
    route: Router,
    public navigationhelperService: NavigationHelperService
  ) {
    this.route = route;
  }

  ngOnInit() {
    this.userDataSubscription = this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
      /*telemetry inplementation for space*/
      this.telemetryImpression = {
        context: {
          env: "workspace"
        },
        edata: {
          type: "view",
          pageid: "add-user-workspace",
          uri: this.route.url,
          subtype: "paginate",
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
      /*telemetry inplementation for space*/
  }
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
          this.orgId = data.result.response.id;
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
          // tslint:disable-next-line:no-shadowed-variable
          this.signupService.createUser1(option1).subscribe(data => {
            this.userId = data.result.userId;
            this.success = true;
            this.userDetails(this.userId);
            this.addmemeber(this.orgId , this.userId);

            this.toasterService.success('user created successfully');
          }, (err) => {
            this.toasterService.error(err.error.params.errmsg);
          });
        }, (err) => {
          console.log(err);
          this.toasterService.error(err.error.message);
          // this.goBackToCoursePage();
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
    // if (this.userProfile.rootOrgAdmin) {
    //   this.route.navigate(['/Workspace/viewuser']);
    // }
    this.route.navigate(['/Workspace/viewuser']);
  }
  userDetails(userId) {
    const option = {
      url: `${this.configService.urlConFig.URLS.USER.GET_PROFILE}${userId}`,
      data: {
        request: {
        }
      }
    };
    this.learnerService.get(option).subscribe(
      data => {
        if (data.responseCode === 'OK') {
          this.updateUser(this.userId, 'CONTENT_CREATOR', this.orgId);
        }
       }, (err) => {
        this.toasterService.error(err.error.params.errmsg);
      });
  }
  addmemeber(orgId , userId) {
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.ADD_MEMBER,
      data: {
        request: {
          userId: userId,
          organisationId: orgId,
        }
      }
    };
    this.learnerService.post(option).subscribe(
      data => {
        if (data.responseCode === 'OK') {
          this.updateUser(this.userId, 'CONTENT_CREATOR', this.orgId);
        }
       }
       );
  }
  updateUser(user, role, orgId) {
    _.forEach(role.value, (value, key) => {
      if (value) {
        this.userroles.push(key);
      }
    });
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.UPDATE_USER_ORG_ROLES,
      data: {
        request: {
          userId: user,
          organisationId: orgId,
          roles: [role]
        }
      }
    };
    this.learnerService.post(option).subscribe(
      data => {
        // this.toasterService.success('user role updated successfully');

        this.goBackToCoursePage();
      },
      err => {
        this.toasterService.error(err.error.params.errmsg);
      }
    );
  }
}
