import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserService, PermissionService, TenantService, LearnerService, ContentService } from './../../services';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { ConfigService, ResourceService, IUserProfile, IUserData } from '@sunbird/shared';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var jQuery: any;

@Component({
  selector: 'app-space-header',
  templateUrl: './space-header.component.html',
  styleUrls: ['./space-header.component.scss']
})
export class SpaceHeaderComponent implements OnInit, OnDestroy {

/**
   * reference of tenant service.
   */
  public tenantService: TenantService;
  /**
   * organization log
   */
  workSpaceRole: Array<string>;
  upForReviewRole: Array<string>;
  exploreButtonVisibility: string;
  logo: string;
  key: string;
  queryParam: any = {};
  showExploreHeader = false;
  showQrmodal = false;
  /**
   * tenant name
   */
  tenantName: string;
  /**
   * user profile details.
   */
  userProfile: IUserProfile;
  /**
   * Sui dropdown initiator
   */
  isOpen: boolean;
  /**
   * Admin Dashboard access roles
   */
  adminDashboard: Array<string>;
  /**
   * Announcement access roles
   */
  announcementRole: Array<string>;
  /**
   * MyActivity access roles
   */
  myActivityRole: Array<string>;
  /**
   * Organization Setup access roles
   */
  orgSetupRole: Array<string>;
  /**
   * reference of UserService service.
   */
  public userService: UserService;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * reference of resourceService service.
   */
  public reviewStatus: any;

  public reviewAssetData = [];
  public resourceService: ResourceService;
  avtarMobileStyle = {
    backgroundColor: 'transparent',
    color: '#AAAAAA',
    fontFamily: 'inherit',
    fontSize: '17px',
    lineHeight: '38px',
    border: '1px solid #e8e8e8',
    borderRadius: '50%',
    height: '38px',
    width: '38px'
  };
  avtarDesktopStyle = {
    backgroundColor: 'transparent',
    color: '#585858',
    fontFamily: 'inherit',
    fontSize: '17px',
    lineHeight: '38px',
    border: '1px solid #585858',
    borderRadius: '50%',
    height: '38px',
    width: '38px'
  };
  /**
   * reference of permissionService service.
   */
  public permissionService: PermissionService;
  public signUpInteractEdata: IInteractEventEdata;
  public enterDialCodeInteractEdata: IInteractEventEdata;
  public telemetryInteractObject: IInteractEventObject;
  tenantDataSubscription: Subscription;
  userDataSubscription: Subscription;
  exploreRoutingUrl: string;
  pageId: string;
  slug: any;
  modalRef: any;
  public  notificationCount = 0;
  /*
  * constructor
  */
  constructor(config: ConfigService, resourceService: ResourceService, public router: Router,
    permissionService: PermissionService, userService: UserService, tenantService: TenantService,
    public activatedRoute: ActivatedRoute, private cacheService: CacheService,
    public learnService: LearnerService, private modalService: NgbModal,
    public contentService: ContentService) {
    this.config = config;
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.userService = userService;
    this.tenantService = tenantService;
    this.myActivityRole = this.config.rolesConfig.headerDropdownRoles.myActivityRole;
    this.workSpaceRole = this.config.rolesConfig.headerDropdownRoles.workSpaceRole;
    this.upForReviewRole = this.config.rolesConfig.headerDropdownRoles.upForReviewRole;
   }

  ngOnInit() {
    this.setSlug();
    this.contentStatus();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        let currentRoute = this.activatedRoute.root;
        if (currentRoute.children) {
          while (currentRoute.children.length > 0) {
            const child: ActivatedRoute[] = currentRoute.children;
            child.forEach(route => {
              currentRoute = route;
              if (route.snapshot.data.telemetry) {
                if (route.snapshot.data.telemetry.pageid) {
                  this.pageId = route.snapshot.data.telemetry.pageid;
                } else {
                  this.pageId = route.snapshot.data.telemetry.env;
                }
              }
            });
          }
        }
      });
    try {
      this.exploreButtonVisibility = (<HTMLInputElement>document.getElementById('exploreButtonVisibility')).value;
    } catch (error) {
      this.exploreButtonVisibility = 'false';
    }
    this.getUrl();
    if (!this.userService.loggedIn) {
      this.getCacheLanguage();
    }
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.queryParam = { ...queryParams };
      this.key = this.queryParam['key'];
    });
    this.adminDashboard = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
    this.announcementRole = this.config.rolesConfig.headerDropdownRoles.announcementRole;
    this.myActivityRole = this.config.rolesConfig.headerDropdownRoles.myActivityRole;
    this.orgSetupRole = this.config.rolesConfig.headerDropdownRoles.orgSetupRole;
    this.tenantDataSubscription = this.tenantService.tenantData$.subscribe(
      data => {
        if (data && !data.err) {
          this.logo = data.tenantData.logo;
          this.tenantName = data.tenantData.titleName;
        }
      }
    );
    this.userDataSubscription = this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.slug = this.userProfile.channel;
        }
      });
    this.setInteractEventData();
        // this.selectToGo();

  }
  private setSlug() {
    if (!this.userService.loggedIn) {
     this.slug = _.get(this.activatedRoute, 'snapshot.firstChild.firstChild.params.slug');
    }
  }
  getCacheLanguage() {
    const isCachedDataExists = this.cacheService.exists('portalLanguage');
    if (isCachedDataExists) {
      const data: any | null = this.cacheService.get('portalLanguage');
      this.resourceService.getResource(data);
    }
  }
  navigateToHome() {
    console.log('slug form space header = ' , this.slug);
    if (this.userService.loggedIn) {
      this.router.navigate(['spacehome']);
    } else {
      window.location.href = this.slug ? this.slug : '';
    }
  }
  onEnter(key) {
    this.key = key;
    this.queryParam = {};
    this.queryParam['key'] = this.key;
    if (this.key && this.key.length > 0) {
      this.queryParam['key'] = this.key;
    } else {
      delete this.queryParam['key'];
    }
    this.router.navigate([this.exploreRoutingUrl, 1], {
      queryParams: this.queryParam
    });
  }

  getUrl() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((urlAfterRedirects: NavigationEnd) => {
      if (_.includes(urlAfterRedirects.url, '/explore')) {
        this.showExploreHeader = true;
        const url  = urlAfterRedirects.url.split('?')[0].split('/');
        if (url.indexOf('explore') === 2) {
          this.exploreRoutingUrl = url[1] + '/' + url[2];
        } else {
          this.exploreRoutingUrl = url[1];
        }
      } else if (_.includes(urlAfterRedirects.url, '/explore-course')) {
        this.showExploreHeader = true;
        const url  = urlAfterRedirects.url.split('?')[0].split('/');
        if (url.indexOf('explore-course') === 2) {
          this.exploreRoutingUrl = url[1] + '/' + url[2];
        } else {
          this.exploreRoutingUrl = url[1];
        }
      } else {
        this.showExploreHeader = false;
      }
    });
  }

  closeQrModalEvent(event) {
    this.showQrmodal = false;
  }
  setInteractEventData() {
    this.signUpInteractEdata = {
      id: 'signup',
      type: 'click',
      pageid: 'public'
    };
    this.telemetryInteractObject = {
      id: '',
      type: 'signup',
      ver: '1.0'
    };
    this.enterDialCodeInteractEdata = {
      id: 'click-dial-code',
      type: 'click',
      pageid: 'explore'
    };
  }

  logout() {
    window.location.replace('/logoff');
    this.cacheService.removeAll();
  }

  ngOnDestroy() {
    if (this.tenantDataSubscription) {
      this.tenantDataSubscription.unsubscribe();
    }
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }
  showSideBar() {
    jQuery('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
  }
  gotoContact(value) {
    if ( value === 'about') {
    this.router.navigate(['/space/about']);
    }
    if ( value === 'contact') {
    this.router.navigate(['/space/contactUs']);
    }
    if ( value === 'collaborators') {
      this.router.navigate(['/space/collaborators']);
      }
      if ( value === 'assets') {
        this.router.navigate(['/space/explore']);
        }
}
openSm(content) {
  this.modalRef = this.modalService.open(content,  {centered: true});
}
contentStatus() {
  let mainState;
  let state;
  const archive = [];
   let i = 0, key;
  const keys = Object.keys(localStorage);
console.log('this.notificationCount = ', this.notificationCount);

for (; key = keys[i]; i++) {
  archive.push( key);
}
  for (let j = 0; j < archive.length; j++) {
    console.log( 'j = ', archive[j]);
  const req = {
    url: `${this.config.urlConFig.URLS.CONTENT.GET}/${archive[j]}/?mode=edit`,
  };
  this.contentService.get(req).subscribe(data => {
    console.log('data in main header = ', data);
   mainState = data.result.content.status;
   state = JSON.parse(localStorage.getItem(archive[j]));
  console.log('state = ', state, mainState, archive[j]);
  if (state === 'Review') {
    if (mainState === 'Live') {
      this.notificationCount ++;
      this.reviewAssetData.push(data.result.content);
      console.log('Asset is published', this.notificationCount);
      this.reviewStatus = 'published';
      localStorage.setItem(archive[j], JSON.stringify('Live'));
    }
  }
  if (state === 'Review') {
    if (mainState === 'Draft') {
      this.notificationCount ++;
      this.reviewAssetData.push(data.result.content);
      console.log('Asset is rejected', this.notificationCount);
      this.reviewStatus = 'rejected';
      localStorage.setItem(archive[j], JSON.stringify('Draft'));
    }
  }
});
}
}
readContentStatus(content) {
  console.log('reviewAssetData = ', this.reviewAssetData);
  this.notificationCount = 0;
  this.modalRef = this.modalService.open(content,  {centered: true});
}
}


