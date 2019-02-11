import { Component, OnInit } from '@angular/core';
import { FrameworkService } from '@sunbird/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(public frameworkService: FrameworkService) { }

  ngOnInit() {

  }

}
