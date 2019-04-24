import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserService, PermissionService, TenantService } from './../../services';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { ConfigService, ResourceService, IUserProfile, IUserData } from '@sunbird/shared';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { FrameworkService } from './../../../core/services/framework/framework.service';
import { forEach } from '@angular/router/src/utils/collection';
declare var jQuery: any;
/**
 * Main header component
 */
@Component({
  selector: 'app-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  /**
   * reference of tenant service.
   */
  public tenantService: TenantService;
  /**
   * organization log
   */
  exploreButtonVisibility: string;
  logo: string;
  key: string;
  queryParam: any = {};
  showExploreHeader = false;
  showQrmodal = false;
  /*
  *to handle the workspace permissions
  */
  workSpaceRole: Array<string>;
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
  categoryNames = [];
  frameWorkName = '';
  termNames = [];
  terms = [];

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
    color: '#AAAAAA',
    fontFamily: 'inherit',
    fontSize: '17px',
    lineHeight: '38px',
    border: '1px solid #e8e8e8',
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
  /*
  * constructor
  */
  constructor(config: ConfigService, resourceService: ResourceService, public router: Router,
    permissionService: PermissionService, userService: UserService, tenantService: TenantService,
    public activatedRoute: ActivatedRoute, private cacheService: CacheService,
    private frameworkService: FrameworkService) {
    this.config = config;
    this.resourceService = resourceService;
    this.permissionService = permissionService;
    this.userService = userService;
    this.tenantService = tenantService;
    this.workSpaceRole = this.config.rolesConfig.headerDropdownRoles.workSpaceRole;
  }

  ngOnInit() {
    this.terms = [];
    this.getFrameworkCategoryandterms('niit_tv');
    // save framework name to the local storage
    /* if (this.userService.loggedIn) {
      if(window.localStorage.getItem('default_framework') !== undefined){
        alert('logged in with framework');
        this.frameWorkName = window.localStorage.getItem('default_framework');
      this.getFrameworkCategoryandterms(this.frameWorkName);
      }
      else {
        alert('logged in with no default_framework')
        //get framework details from the framework service and store it in localstorage
        this.frameworkService.frameworkData$.subscribe((frameworkData) => {
          if (frameworkData && !frameworkData.err) {
            this.frameWorkName = frameworkData.frameworkdata.defaultFramework.code;
            if(this.frameWorkName == null){
              this.frameWorkName = 'niit_tv';
            }
            window.localStorage.setItem('default_framework', this.frameWorkName);
            this.getFrameworkCategoryandterms(this.frameWorkName);
          }
        });
      }
    }else {
      //when user is not logged in
      this.frameWorkName = window.localStorage.getItem('default_framework');
      alert('found framework '+ this.frameWorkName);
      this.getFrameworkCategoryandterms(this.frameWorkName);
    } */

    jQuery(() => {
      jQuery('.carousel').carousel();
      jQuery('.ui.dropdown').dropdown();
      /*  jQuery(window).on("scroll", function() {
         if(jQuery(window).scrollTop() > 150) {
           jQuery(".header").addClass("active");
         } else {
             //remove the background property so it comes transparent again (defined in your css)
            jQuery(".header").removeClass("active");
         }
     }); */

    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.terms = [];
        this.getFrameworkCategoryandterms('niit_tv');
        let currentRoute = this.activatedRoute.root;
        if (currentRoute.children) {
          while (currentRoute.children.length > 0) {
            const child: ActivatedRoute[] = currentRoute.children;
            child.forEach(route => {
              currentRoute = route;
              console.log('here is  the  current route', currentRoute.data['value']['orgdata']['defaultFramework']);
              /* if(!this.userService.loggedIn){
                alert('updating the categories based');
                this.frameWorkName = currentRoute.data['value']['orgdata']['defaultFramework'];
                if(this.frameWorkName !== undefined ){
                  this.getFrameworkCategoryandterms(this.frameWorkName);
                }else {
                  this.frameWorkName = window.localStorage.getItem('default_framework');
                  this.getFrameworkCategoryandterms(this.frameWorkName);
                }
              } */
              // this.frameWorkName = currentRoute.data['value']['orgdata']['defaultFramework'];
              // console.log('framework name from main header router event', this.frameWorkName);
              // this.getFrameworkCategoryandterms(this.frameWorkName);
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
        console.log('data img', data.tenantData.logo);
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
        }
      });
    this.setInteractEventData();
  }

  getCacheLanguage() {
    const isCachedDataExists = this.cacheService.exists('portalLanguage');
    if (isCachedDataExists) {
      const data: any | null = this.cacheService.get('portalLanguage');
      this.resourceService.getResource(data);
    }
  }
  navigateToHome() {
    this.router.navigate(['']);
    /* if (this.userService.loggedIn) {
      this.router.navigate(['resources']);
    } else {
      this.router.navigate(['']);
    } */
  }

  navigateToWorkspace() {
    const authroles = this.permissionService.getWorkspaceAuthRoles();
    if (authroles) {
      console.log('authroles determination is done via ', authroles);
      this.router.navigate([authroles.url]);
    }
  }
  onEnter(key) {
    console.log('key', key);
    this.key = key;
    this.queryParam = {};
    this.queryParam['key'] = this.key;
    if (this.key && this.key.length > 0) {
      this.queryParam['key'] = this.key;
    } else {
      delete this.queryParam['key'];
    }
    this.router.navigate(['/search/explore-course', 1], {
      queryParams: this.queryParam
    });
  }

  getUrl() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((urlAfterRedirects: NavigationEnd) => {
      // reset the dropdrown of categories on route change
      jQuery('.ui.dropdown').dropdown('restore defaults');
      if (_.includes(urlAfterRedirects.url, '/explore')) {
        this.showExploreHeader = true;
        const url = urlAfterRedirects.url.split('?')[0].split('/');
        if (url.indexOf('explore') === 2) {
          this.exploreRoutingUrl = url[1] + '/' + url[2];
        } else {
          this.exploreRoutingUrl = url[1];
        }
      } else if (_.includes(urlAfterRedirects.url, '/explore-course')) {
        this.showExploreHeader = true;
        const url = urlAfterRedirects.url.split('?')[0].split('/');
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

  getFrameworkCategoryandterms(framework) {
    // alert('called get category terms');
    this.terms = [];
    const temp = [];
    this.frameworkService.getFrameworkCategories(framework).subscribe(categoryData => {
      console.log('recieved category data in header ', categoryData.result.framework.categories);
      // pull out terms from all the categories and keep them in one arry
      this.termNames = categoryData.result.framework.categories;
      // pull out terms from all the categories
      this.termNames.forEach((category) => {
        if ((category['code'] === 'gradeLevel')
        && category.hasOwnProperty('terms')
        && category.terms.length > 0) {
          const capturedTermArray = category.terms;
          capturedTermArray.forEach(term => {
            temp.push(term.name);
          });
        }
      });
      this.terms = temp;
      console.log('list of categories picked are ', this.termNames);
      console.log('list of terms created as ', this.terms);
    });
  }

  getFramework(framework) {
    console.log('framework', framework);
    const key = { key: framework };
    this.router.navigate(['/search/explore-course', 1], {
      queryParams: key
    });
  }

  signIn() {
    window.location.replace('/learn');
  }
}
