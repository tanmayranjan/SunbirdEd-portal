import { ResourceService } from '../../services/index';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
import { Router } from '@angular/router';

import { SharedTenantResolverService } from '../../services/tenant-resolver/shared-tenant-resolver.service'

@Component({
  selector: 'app-landingpage-card',
  templateUrl: './landingpage-card.component.html',
  styleUrls: ['./landingpage-card.component.css']
})
export class LandingpageCardComponent implements OnInit {
  /**
* content is used to render IContents value on the view
*/
  @Input() data: ICard;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();

  Userrating = 3;
  displayRating = false;

  constructor(public resourceService: ResourceService,
    public router: Router,
    private tenantTheme : SharedTenantResolverService
    ) {
    this.resourceService = resourceService;
  }

  ngOnInit(): void {
    console.log('recieved data in the card is ', this.data);
    let tenantConfig = this.tenantTheme.getTenantThemeConfig('Home');
    if ( tenantConfig && tenantConfig['cards'] !== undefined ) {
        this.displayRating = tenantConfig['cards']['rating'];
    }
    console.log('Ratings decider is ', this.displayRating);
    this.data['rating'] = this.getRandomNum(0);
    this.data['dummyWeeks'] = this.getRandomNum(1);
  }

  public onAction(data, action) {

    action = {
      eventName: 'onImage'
    };
    console.log(action);
    data.action = action;
    console.log(data);
    this.clickEvent.emit({ 'action': action, 'data': data });
    this.router.navigate(['/play/collection', data.identifier]);
  }

  getRandomNum(minLimit) {
    return (Math.floor(Math.random() * (+6 - +minLimit)) + +minLimit);
  }
}
