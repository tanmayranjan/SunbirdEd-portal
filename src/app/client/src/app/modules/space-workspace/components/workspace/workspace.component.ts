import { Component, OnInit } from '@angular/core';
import { PermissionService, UserService } from '@sunbird/core';
import { Subscription } from 'rxjs';
import { IUserData, IUserProfile} from '@sunbird/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import { NavigationHelperService } from '@sunbird/shared';
import { IImpressionEventInput } from '@sunbird/telemetry';
@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
  providers: [NgbModal]
})
export class WorkspaceComponent implements OnInit {
 public permissionService: PermissionService;
 userDataSubscription: Subscription;
 public userService: UserService;
 userProfile: IUserProfile;
 adminDashboard: Array<string>;
 modalRef: any;
 telemetryImpression: IImpressionEventInput;
  constructor(permissionService: PermissionService, userService: UserService,
    private modalService: NgbModal,
     public router: Router,
    public navigationhelperService: NavigationHelperService
    ) {
    this.permissionService = permissionService;
    this.userService = userService;
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
          env: 'workspace'
        },
        edata: {
          type: 'view',
          pageid: 'workspace',
          uri: this.router.url,
          subtype: 'paginate',
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
      /*telemetry inplementation for space*/
  }
  openLg(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

}
