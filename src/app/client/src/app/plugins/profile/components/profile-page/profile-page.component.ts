import { ProfileService } from '../../services';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { UserService, SearchService, PlayerService, CoursesService, OrgDetailsService } from '@sunbird/core';
import {
  ResourceService, ConfigService, ServerResponse, IUserProfile, IUserData, ToasterService, UtilService,
  NavigationHelperService
} from '@sunbird/shared';
import { first } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { Subscription } from 'rxjs';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
@Component({
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy, AfterViewInit {
  public slug: string;
  @ViewChild('profileModal') profileModal;
  @ViewChild('slickModal') slickModal;
  userProfile: any;
  contributions = [];
  attendedTraining: Array<object>;
  roles: Array<string>;
  showMoreRoles = true;
  showMoreTrainings = true;
  isCustodianOrgUser = false;
  showMoreRolesLimit = this.configService.appConfig.PROFILE.defaultShowMoreLimit;
  courseLimit = this.configService.appConfig.PROFILE.defaultViewMoreLimit;
  showEdit = false;
  userSubscription: Subscription;
  orgDetails = [];
  showContactPopup = false;
  showEditUserDetailsPopup = false;
  state: string;
  district: string;
  userFrameWork: any;
  telemetryImpression: IImpressionEventInput;
  myFrameworkEditEdata: IInteractEventEdata;
  editProfileInteractEdata: IInteractEventEdata;
  editMobileInteractEdata: IInteractEventEdata;
  editEmailInteractEdata: IInteractEventEdata;
  telemetryInteractObject: IInteractEventObject;
  btnArrow: string;
  telemetryLogs = [];
  orgId: any;
  constructor(private cacheService: CacheService, public resourceService: ResourceService, public coursesService: CoursesService,
    public toasterService: ToasterService, public profileService: ProfileService, public userService: UserService,
    public configService: ConfigService, public router: Router, public utilService: UtilService, public searchService: SearchService,
    private playerService: PlayerService, private activatedRoute: ActivatedRoute, public orgDetailsService: OrgDetailsService,
    public navigationhelperService: NavigationHelperService) {
  }

  ngOnInit() {
    this.getCustodianOrgUser();
    this.userSubscription = this.userService.userData$.subscribe((user: IUserData) => {
      if (user.userProfile) {
        this.userProfile = user.userProfile;
        this.slug = this.userProfile.channel;
        this.orgId = this.userProfile.rootOrgId;
        console.log('slug in profile page = ', this.slug);
        this.state = _.get(_.find(this.userProfile.userLocations, { type: 'state' }), 'name');
        this.district = _.get(_.find(this.userProfile.userLocations, { type: 'district' }), 'name');
        this.userFrameWork =  this.userProfile.framework ? _.cloneDeep(this.userProfile.framework) : {};
        this.getOrgDetails();
      }
    });
    this.getContribution();
    this.getTrainingAttended();
    this.setInteractEventData();
  }

  getOrgDetails() {
    let orgList = [];
    this.roles = [];
    _.forEach(this.userProfile.organisations, (org, index) => {
      if (this.userProfile.rootOrgId !== org.organisationId) {
        orgList.push(org);
      }
      _.forEach(org.roles, (value, key) => {
        if (value !== 'PUBLIC') {
          const roleName = _.find(this.userProfile.roleList, {id: value});
          if (roleName) {
            this.roles.push(roleName['name']);
          }
        }
      });
    });
    this.roles = _.uniq(this.roles);
    orgList = _.sortBy(orgList, ['orgjoindate']);
    this.orgDetails = orgList[0];
  }

  convertToString(value) {
    return _.isArray(value) ? _.join(value, ', ') : undefined;
  }

  getLocationDetails(locations, type) {
    const location: any = _.find(locations, { type: type });
    return location ? location.name : false;
  }

  getContribution(): void {
    const response = this.searchService.searchedContentList;
    const { constantData, metaData, dynamicFields }  = this.configService.appConfig.Course.otherCourse;
    if (response) {
      this.contributions = this.utilService.getDataForCard(response.content, constantData, dynamicFields, metaData);
    } else {
      const searchParams = {
        status: ['Live'],
        // objectType: 'Asset',
        channel: this.orgId,
        // contentType: ['Collection', 'TextBook', 'Course', 'LessonPlan', 'Resource'],
        params: { lastUpdatedOn: 'desc' }
      };
      const inputParams = { params: this.configService.appConfig.PROFILE.contentApiQueryParams };
      this.searchService.searchAssetByUserId(searchParams, inputParams).subscribe((data: ServerResponse) => {
        this.contributions = this.utilService.getDataForCard(data.result.Asset, constantData, dynamicFields, metaData);
      });
    }
  }

  getTrainingAttended() {
    this.coursesService.enrolledCourseData$.pipe(first()).subscribe(data => {
      this.attendedTraining = _.filter(data.enrolledCourses, {status: 2}) || [];
    });
  }

  toggle(showMore) {
    if (showMore === true) {
      this.showMoreRolesLimit = this.roles.length;
      this.showMoreRoles = false;
    } else {
      this.showMoreRoles = true;
      this.showMoreRolesLimit = this.configService.appConfig.PROFILE.defaultShowMoreLimit;
    }
  }

  toggleCourse(showMoreCourse) {
    if (showMoreCourse === true) {
      this.courseLimit = this.attendedTraining.length;
      this.showMoreTrainings = false;
    } else {
      this.showMoreTrainings = true;
      this.courseLimit = 3;
    }
  }

  updateProfile(data) {
    this.profileService.updateProfile({framework: data}).subscribe(res => {
      this.userProfile.framework = data;
      this.toasterService.success(this.resourceService.messages.smsg.m0046);
      this.profileModal.modal.deny();
      this.showEdit = false;
    }, err => {
      this.showEdit = false;
      this.toasterService.warning(this.resourceService.messages.emsg.m0012);
      this.profileModal.modal.deny();
      this.cacheService.set('showFrameWorkPopUp', 'installApp' );
    });
  }

  openContent(content) {
    this.playerService.playContent(content.data.metaData);
  }

  public prepareVisits(event) {
    const inViewLogs = _.map(event, (content, index) => ({
      objid: content.metaData.courseId ? content.metaData.courseId : content.metaData.identifier,
      objtype: 'course', index: index,
      section: content.section,
    }));
    if (this.telemetryImpression) {
      this.telemetryImpression.edata.visits = inViewLogs;
      this.telemetryImpression.edata.subtype = 'pageexit';
      this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }
  }
  private getCustodianOrgUser() {
    this.orgDetailsService.getCustodianOrg().subscribe(custodianOrg => {
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrg, 'result.response.value')) {
        this.isCustodianOrgUser = true;
      }
    });
  }

  setInteractEventData() {
    this.myFrameworkEditEdata = {
      id: 'profile-edit-framework',
      type: 'click',
      pageid: 'profile-read'
    };
    this.editProfileInteractEdata = {
      id: 'profile-edit-address',
      type: 'click',
      pageid: 'profile-read'
    };
    this.editMobileInteractEdata = {
      id: 'profile-edit-mobile',
      type: 'click',
      pageid: 'profile-read'
    };
    this.editEmailInteractEdata = {
      id: 'profile-edit-emailId',
      type: 'click',
      pageid: 'profile-read'
    };
    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'User',
      ver: '1.0'
    };
  }
  beforeContributionSlideChange(event) {
    if (event.currentSlide === 0 && event.nextSlide === 0) {
      this.btnArrow = 'prev-button';
    } else if (event.currentSlide < event.nextSlide) {
      this.btnArrow = 'next-button';
    } else if (event.currentSlide > event.nextSlide) {
      this.btnArrow = 'prev-button';
    }
  }
  onTelemetryEvent(contribution, event) {
    const CONTRIBUTION_SLIDE_COUNT_FIRST = 1;
    const CONTRIBUTION_SLIDE_COUNT_LAST = 5;
    // const slideData = contribution.slice(event.currentSlide + CONTRIBUTION_SLIDE_COUNT_FIRST,
    //   event.currentSlide + CONTRIBUTION_SLIDE_COUNT_LAST);
    const slideData = contribution.slice(event.currentSlide + 1, event.currentSlide + 5);
    _.forEach(slideData, (slide, key) => {
      const obj = _.find(this.telemetryLogs, (o) => {
        return o.objid === slide.metaData.identifier;
      });
      if (obj === undefined) {
        this.telemetryLogs.push({
          objid: slide.metaData.identifier || '',
          objtype: 'profile',
          index: event.currentSlide + key,
          section: 'Contribution'
        });
      }
    });
    this.telemetryImpression.edata.visits = this.telemetryLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }

  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        object: {
          id: this.userService.userid,
          type: 'User',
          ver: '1.0'
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: 'profile-read',
          subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
          uri: this.router.url,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
