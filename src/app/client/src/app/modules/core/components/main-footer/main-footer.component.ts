import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css']
})
export class MainFooterComponent implements OnInit {
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

  constructor(resourceService: ResourceService ,  public router: Router) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
  }
  gotoContact(value) {
    console.log('inside function', value);
    if ( value === 'contact') {
    this.router.navigate(['contactUs']);
    }
    if ( value === 'license') {
    this.router.navigate(['license']);
    }
    if ( value === 'people') {
    this.router.navigate(['people']);
    }
  }
}
