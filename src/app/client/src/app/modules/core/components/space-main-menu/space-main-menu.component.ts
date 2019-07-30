import {
  ConfigService, ResourceService, IUserData, IUserProfile,
  ToasterService, ServerResponse
} from '@sunbird/shared';
import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { UserService, PermissionService, LearnerService } from '../../services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { first, filter } from 'rxjs/operators';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import * as _ from 'lodash-es';
declare var jQuery: any;
import { PublicDataService } from '../../services/public-data/public-data.service';
import { ConfigureService } from '../../services/configure/configure.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-space-main-menu',
  templateUrl: './space-main-menu.component.html',
  styleUrls: ['./space-main-menu.component.scss'],
  providers: [NgbModal],
  encapsulation: ViewEncapsulation.None,
})
export class SpaceMainMenuComponent implements OnInit {
  @Input() slugInfo: string;
  @ViewChild('modalTemplate')
  email: any;
  name: any;
  org: any;
  message: any;
  closeResult: string;
  alert = false;
  userData: any;
userName: any;
userEmail: any;
orgName: any;
loading: any;
  public modalTemplate: ModalTemplate<{ data: string }, string, string>;
  /**
   * Workspace access roles
   */
  adminDashboard: Array<string>;
  workSpaceRole: Array<string>;
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /**
   * reference of UserService service.
   */
  public userService: UserService;
  /**
   * reference of permissionService service.
   */
  public permissionService: PermissionService;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
 * user profile details.
 */
  userProfile: IUserProfile;
  /**
   * reference of Router.
   */
  private router: Router;
  homeMenuIntractEdata: IInteractEventEdata;
  learnMenuIntractEdata: IInteractEventEdata;
  libraryMenuIntractEdata: IInteractEventEdata;
  workspaceMenuIntractEdata: IInteractEventEdata;
  userDataSubscription: Subscription;
  exploreRoutingUrl: string;
  showExploreHeader = false;
  add = false;
  helpLinkVisibility: string;
  private toasterService: ToasterService;
  success = false;
  user: any;
  registerForm1: FormGroup;
  submitted = false;
  modalRef: any;
  /*
  * constructor
  */
  constructor(resourceService: ResourceService, userService: UserService, router: Router,
    public modalServices: SuiModalService, toasterService: ToasterService, public learnService: LearnerService,
    permissionService: PermissionService, config: ConfigService, private cacheService: CacheService,
     public publicDataService: PublicDataService, private formBuilder: FormBuilder,
    public dataService: ConfigureService, private modalService: NgbModal) {
    this.resourceService = resourceService;
    this.userService = userService;
    this.permissionService = permissionService;
    this.router = router;
    this.config = config;
    this.workSpaceRole = this.config.rolesConfig.headerDropdownRoles.workSpaceRole;
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.adminDashboard = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
    try {
      this.helpLinkVisibility = (<HTMLInputElement>document.getElementById('helpLinkVisibility')).value;
    } catch (error) {
      this.helpLinkVisibility = 'false';
    }
    this.setInteractData();
    this.getUrl();
    this.userService.userData$.pipe(first()).subscribe(
      (user: IUserData) => {
        console.log('user info from space main menu = ', user);
        this.user = user.userProfile;
        this.userName = this.user.firstName;
        this.userEmail = this.user.email;
        this.orgName = this.user.rootOrg.orgName;
      });
      this.registerForm1 = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        message: ['', [ Validators.required]]
    });
    this.userDataSubscription = this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
  }
  get f() { return this.registerForm1.controls; }

    onSubmit() {
        this.submitted = true;
   this.email = this.registerForm1.value.email;
   this.message = this.registerForm1.value.message;

        if (this.registerForm1.invalid) {
            return;
        }
        this.sendNotification();

    }
  setInteractData() {
    this.homeMenuIntractEdata = {
      id: 'home-tab',
      type: 'click',
      pageid: 'home'
    };
    this.libraryMenuIntractEdata = {
      id: 'library-tab',
      type: 'click',
      pageid: 'library'
    };
    this.learnMenuIntractEdata = {
      id: 'learn-tab',
      type: 'click',
      pageid: 'learn'
    };
    this.workspaceMenuIntractEdata = {
      id: 'workspace-menu-button',
      type: 'click',
      pageid: 'workspace'
    };
  }

  logout() {
    window.location.replace('/logoff');
    this.cacheService.removeAll();
  }

  showSideBar() {
    jQuery('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
  }

  getUrl() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((urlAfterRedirects: NavigationEnd) => {
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

  navigateToWorkspace() {
    const authroles = this.permissionService.getWorkspaceAuthRoles();
    if (authroles) {
      this.router.navigate([authroles.url]);
    }
  }


  sendNotification() {
    this.success = !this.success;
    this.userData = 'Name: ' + this.userName + '<br>' + 'Email Id: ' + this.email + '<br>' +
    'Organization Name: ' + this.orgName + '<br>' + 'Message: ' + this.message;
console.log('data config info in main menu = ', this.dataService.dataConfig);
    const body = {
      request: {

        subject: this.dataService.dataConfig.default.subject,

        body: this.dataService.dataConfig.default.body + '<br>' + this.userData,

        orgImgUrl: this.dataService.dataConfig.default.orgImgUrl,

        emailTemplateType: this.dataService.dataConfig.default.template,

        fromEmail: this.dataService.dataConfig.default.fromEmail,

        recipientEmails: this.dataService.dataConfig.default.email

    }
     };

        const req = {
          url: `${this.config.urlConFig.URLS.FEEDBACK.EMAIL}`,
          data: body
        };
        this.learnService.post(req).subscribe( (data: ServerResponse) => {
          this.alert = !this.alert;
          this.toasterService.success('Thanks for your valuable feedback.');
          this.modalRef.close();
    return data;

        });
    }
  openSm(content) {
    this.modalRef = this.modalService.open(content,  {centered: true});
  }

}
