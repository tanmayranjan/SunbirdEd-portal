import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService } from '../../../core/services';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  providers: [NgbCarouselConfig]
})
export class LandingPageComponent implements OnInit {
  images = [1, 2, 3].map(() => `../../.../../../../../assets/images/banner_bg.jpg${Math.random()}`);
  public userService: UserService;
  showNavigationArrows = false;
  showNavigationIndicators = false;
  constructor( userService: UserService ,config: NgbCarouselConfig) {
    this.userService = userService;
    config.showNavigationArrows = true;
      config.showNavigationIndicators = true;
  }

  ngOnInit() {

   console.log('log in ', this.userService.loggedIn);
  }

}
