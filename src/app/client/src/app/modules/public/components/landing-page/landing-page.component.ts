import { Component, OnInit } from '@angular/core';
import { UserService, PermissionService } from '../../../core/services';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  public userService: UserService;
  images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  constructor( userService: UserService ) {
    this.userService = userService;
  }

  ngOnInit() {

   console.log('log in ', this.userService.loggedIn);
  }
}
