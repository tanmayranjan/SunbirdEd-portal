import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { Router } from '@angular/router';
import { UserService } from '../../services';

@Component({
  selector: 'app-space-footer',
  templateUrl: './space-footer.component.html',
  styleUrls: ['./space-footer.component.scss']
})
export class SpaceFooterComponent implements OnInit {
/**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /*
  Date to show copyright year
  */
  date = new Date();
  /*
  Hide or show footer
  */
  showFooter = true;
  padding;
  constructor(resourceService: ResourceService ,  public router: Router,
    public userService: UserService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
if (this.userService.loggedIn) {
this.padding = true;
}
  }
  gotoContact(value) {
  //   if (this.userService.loggedIn) {
  //   if ( value === 'contact') {
  //   this.router.navigate(['contactUs']);
  //   }
  //   if ( value === 'policy') {
  //   this.router.navigate([value]);
  //   }
  //   if ( value === 'process') {
  //   this.router.navigate([value]);
  //   }
  //   if ( value === 'termsOfUse') {
  //     this.router.navigate([value]);
  //     }
  // } else {
    if ( value === 'contact') {
      this.router.navigate(['contactUs']);
      }
      if ( value === 'policy') {
      this.router.navigate(['/space/' + value]);
      }
      if ( value === 'process') {
      this.router.navigate(['/space/' + value]);
      }
      if ( value === 'termsOfUse') {
        this.router.navigate(['/space/' + value]);
        }
  // }
}
}
