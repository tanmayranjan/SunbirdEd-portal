import { Component, OnInit, Output, EventEmitter, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ConfigService, IUserData } from '@sunbird/shared';
import { UserService, LearnerService, PublicDataService  } from '@sunbird/core';
import * as _ from 'lodash-es';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse } from '@sunbird/shared';
import {Router, ActivatedRoute} from '@angular/router';
import { UserSearchServicePublicService  } from '../../services/searchservices/user-search-service-public.service';
import { element, componentRefresh } from '@angular/core/src/render3/instructions';
import { Subscription } from 'rxjs';
import { IUserProfile, NavigationHelperService } from '@sunbird/shared';
import { IImpressionEventInput } from '@sunbird/telemetry';
@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.css'],
  providers: [NgbModal]
})
export class ViewuserComponent implements OnInit {
  @ViewChild('modal') modal;
  update: string;
  userIds = [];
  assignRole = false;
  selectedvalue;
  selectedid;
  show = false;
  userroles = [];
  existingUserRoles;
  role = [];
  uniqueRoles = [];
  finalRoles = [];
  modalRef: any;
  selectedOrgName: string;
  roles = [
    { name: 'CONTENT_CREATOR'},
    { name: 'BOOK_CREATOR' },
    { name: 'CONTENT_REVIEWER' },
    { name: 'TEACHER_BADGE_ISSUER' }
  ];
  selectedOrgUserRoles = [];
  selectedOrgUserRolesNew: any = [];
  condition = false;
  count: number;
  userUniqueId: any;
  orgId: any;
  userDetail: any;
  roleforUser: any;
  updaterole: any[];
  ref: HTMLElement;
  userDataSubscription: Subscription;
  userProfile: IUserProfile;
  telemetryImpression: IImpressionEventInput;
  constructor(
    public configService: ConfigService,
    public userService: UserService,
    public learnerService: LearnerService,
    public publicdataService: PublicDataService,
    public toasterService: ToasterService,
    private modalService: NgbModal,
    public router: Router,
    public userSearchService: UserSearchServicePublicService,
    public resourceService: ResourceService,
    public activatedRoute: ActivatedRoute,
    public navigationhelperService: NavigationHelperService
  ) {}
  receiveMessage($event) {
    this.update = $event;
    if (this.update) {
      this.gottoCancel();
    }
  }
  ngOnInit() {
    this.getUsersList();
    this.roleforUser = [];
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
          pageid: "viewuser-workspace",
          uri: this.router.url,
          subtype: "paginate",
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
      /*telemetry inplementation for space*/
  }
  editRoles(role, userRoles, event, userId) {
 userRoles.forEach((element1, value) => {

 if (element1.id === userId) {
  if (element1.roles.includes(role) === true) {

    this.selectedOrgUserRoles[value].roles = element1.roles.filter((selectedRole) => {

      return selectedRole !== role;
    });

  } else {
    if (event.target.checked === true) {
      this.selectedOrgUserRolesNew.push(role);

    } else {
      this.selectedOrgUserRolesNew.splice(this.selectedOrgUserRolesNew.indexOf(role));

    }
  } this.updaterole = this.selectedOrgUserRoles;

 }
 }
 );
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
      let userorgName;
      _.forOwn(response, content => {
        _.forEach(content, value => {
          _.forEach(value, user => {
            userorgName = user.userName;

            this.userDetail = user;
            _.forEach(user.organisations, (userorg: any) => {

              this.existingUserRoles = userorg.roles;
              userorgid = userorg.organisationId;

            });

            if (user.organisations.length > 0) {
              this.userUniqueId = user.id;
              this.orgId = userorgid;

              const userid = {
                id: user.id,
                organisationId: userorgid,
                organisationName: userorgName,
                firstName: user.firstName,
                provider: this.userService.rootOrgId,
                roles: this.existingUserRoles,
                status: user.status
              };
              const roles = {
                id: user.id,
                roles: this.existingUserRoles,

            };
            this.selectedOrgUserRoles.push(roles);

              this.userIds.push(userid);
            }
          });
        });

      });
    });
  }

  updateRoles(roles, userIds, userRoles) {
const rolesUnique = _.uniqWith(roles, _.isEqual);

    if (this.selectedOrgUserRolesNew) {
      this.selectedOrgUserRolesNew.forEach((Newroles) => {
        this.selectedOrgUserRoles.forEach(user => {
          if (userIds === user.id) {
            user.roles.push(Newroles);
          }
        });
      });
      const mainRole = [];
      const mainRolesCollections = _.clone(this.roles);
      _.forEach(mainRolesCollections, (value, key) => {
        mainRole.push(value.name);
      });

      this.selectedOrgUserRoles.forEach(element1 => {
  if (element1.id === userIds ) {
    element1.roles.forEach(oldRole => {
      if (userRoles.includes(oldRole)) {

        if (oldRole !== 'PUBLIC') {
          this.roleforUser.push(oldRole);

        } else {
          this.roleforUser.push(oldRole);

        }
      }
    }); }

});
this.roleforUser = Array.from(new Set(this.roleforUser));

      const option = { userId: userIds , orgId: this.orgId, roles: this.roleforUser };
      this.userSearchService.updateRoles(option).subscribe(
        (apiResponse: ServerResponse) => {
          this.toasterService.success(this.resourceService.messages.smsg.m0028);
this.userIds = [];
   this.gottoCancel();
        },
        err => {
          this.selectedOrgUserRoles = _.difference(this.selectedOrgUserRoles, this.selectedOrgUserRolesNew);
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
          // this.redirect();
        }
      );
    }
    this.selectedOrgUserRoles = [];

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
        this.userIds = [];
        this.goToUsers();
      },
      err => {
        console.log('err', err);
        this.toasterService.error(err.error.params.errmsg);
      }
    );
  }

  openLg(content) {
  this.modalRef = this.modalService.open(content, { size: 'sm' , centered: true});
  }

  goToUsers() {
setTimeout(() => {
      this.router.navigate(['/Workspace/viewuser']);
      this.ngOnInit();
}, 500);
  }
  gottoCancel() {
    setTimeout(() => {
      this.userIds = [];
      this.router.navigate(['/Workspace/viewuser']);
      this.ngOnInit();
    }, 2000);
    this.modalRef.close();
  }
  cancel() {
    this.modalRef.close();
  }

}
