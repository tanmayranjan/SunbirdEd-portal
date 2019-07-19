import { Component, OnInit } from '@angular/core';
import { PermissionService, UserService } from '@sunbird/core';
import { Subscription } from 'rxjs';
import { IUserData, IUserProfile} from '@sunbird/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(permissionService: PermissionService, userService: UserService,
    private modalService: NgbModal
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
  }
  openLg(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

}
