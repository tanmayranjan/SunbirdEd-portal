import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { UserService, LearnerService, PublicDataService } from '@sunbird/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.css']
})
export class ViewuserComponent implements OnInit {
  userIds = [];
  assignRole = false;
  selectedvalue;
  selectedid;
  show = false;
  userroles = [];
  existingUserRoles;
  openModal = false;
  userToUpdate;
  roles = [
    { name: 'COURSE_MENTOR' },
    { name: 'CONTENT_CREATOR ' },
    { name: 'BOOK_CREATOR' },
    { name: 'CONTENT_REVIEWER' },
    { name: 'CONTENT_REVIEW' },
    { name: 'BOOK_REVIEWER ' },
    { name: 'FLAG_REVIEWER' }
  ];
  constructor(
    public configService: ConfigService,
    public userService: UserService,
    public learnerService: LearnerService,
    public publicdataService: PublicDataService,
    public toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.getUsersList();
  }
  getUsersList() {
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          query: this.userService.rootOrgId,
          filters: {
            createdBy: this.userService.userid
          }
        }
      }
    };
    this.learnerService.post(option).subscribe(data => {
      const response = data.result;
      let userorgid;
      console.log(data.result);
      _.forOwn(response, content => {
        _.forEach(content, value => {
          _.forEach(value, user => {
            _.forEach(user.organisations, (userorg: any) => {
              this.existingUserRoles = userorg.roles;
              userorgid = userorg.organisationId;
            });
            if (user.organisations.length > 0) {
              const userid = {
                id: user.id,
                organisationId: userorgid,
                userName: user.userName,
                provider: this.userService.rootOrgId,
                roles: this.existingUserRoles
              };
              this.userIds.push(userid);
            }
          });
        });
      });
    });
  }
  updateUser(user, role) {
    console.log(user);
    _.forEach(role.value, (value, key) => {
      if (value) {
        this.userroles.push(key);
      }
    });
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.UPDATE_USER_ORG_ROLES,
      data: {
        request: {
          userId: user.id,
          organisationId: user.organisationId,
          roles: this.userroles
        }
      }
    };
    this.learnerService.post(option).subscribe(
      data => {
        console.log(data);
        console.log(option);
        this.toasterService.success('user role updated successfully');
        this.goBackToCoursePage();
      },
      err => {
        this.toasterService.error(err);
        this.goBackToCoursePage();
      }
    );
  }

  deleteUser(user) {
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.REMOVE_USER,
      data: {
        request: {
          userId: user.id,
          organisationId: user.organisationId,
          userName: user.firstName,
          provider: user.provider,
        }
      }
    };
    this.learnerService.post(option).subscribe(
      data => {
        console.log(data);
        this.toasterService.success('user deleted successfully');

        this.goBackToCoursePage();
      },
      err => {
        this.toasterService.error(err);
      }
    );
  }
  goBackToCoursePage() {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
showModal(user) {
  this.userToUpdate = user;
  console.log(user);
  this.openModal = !this.openModal;
}
}
