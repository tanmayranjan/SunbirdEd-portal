import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild } from '@angular/core';
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
  csvRows = [];
  csvValues = [];
  userData = [];
  // @ViewChild('down') targetEl: ElementRef;
  roles = [
    { name: 'COURSE_MENTOR' },
    { name: 'CONTENT_CREATOR ' },
    { name: 'BOOK_CREATOR' },
    { name: 'CONTENT_REVIEWER' },
    { name: 'CONTENT_REVIEW' },
    { name: 'BOOK_REVIEWER ' },
    { name: 'FLAG_REVIEWER' }
  ];
//  falseClick(el: ElementRef) {
//     this.targetEl.nativeElement.click();
//   }
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
      _.forOwn(response, content => {
        _.forEach(content, value => {
          _.forEach(value, user => {
            // console.log(user);
            _.forEach(user.organisations, (userorg: any) => {
              this.existingUserRoles = userorg.roles;
              userorgid = userorg.organisationId;
            });
            if (user.organisations.length > 0) {
              const userid = {
                id: user.id,
                organisationId: userorgid,
                userName: user.userName || user.firstName,
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
  getUserData() {
    console.log(this.userIds);
    const csvdata = this.downloadFile(this.userIds);
    this.download(csvdata);
  }
  downloadFile(data) {
    console.log(data);
    const replacer = [];
    const headers = Object.keys(data[0]);
    this.csvRows.push(headers.join(','));

    for (const row of data) {
const values = headers.map(header => {
  const escaped  = ('' + row[header]).replace(/"/g, '\\"');
return `'${escaped}'`;
});
this.csvRows.push(values.join(','));
    }
  return this.csvRows.join('\n');
}
download(data) {
const blob = new Blob([data], {type: 'text/csv'});
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.setAttribute('hidden', '');
a.setAttribute('href', url);
a.setAttribute('download', 'download.csv');
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
}
  updateUser(user, role) {
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

        this.toasterService.success('user role updated successfully');
        // this.goBackToCoursePage();
      },
      err => {
        this.toasterService.error(err.error.params.err);
        // this.goBackToCoursePage();
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
        this.toasterService.success('user deleted successfully');

        // this.goBackToCoursePage();
      },
      err => {
        this.toasterService.error(err.error.params.err);
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
  this.openModal = !this.openModal;
}
}
