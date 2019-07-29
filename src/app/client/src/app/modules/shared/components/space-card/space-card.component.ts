import { ResourceService } from '../../services/index';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
import {Router} from '@angular/router';
// import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-space-card',
  templateUrl: './space-card.component.html',
  styleUrls: ['./space-card.component.scss']
})
export class SpaceCardComponent  {
  @Input() slug: string;
  @Input() data: ICard;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();

  constructor(public resourceService: ResourceService, public router: Router) {
    console.log('content in space cards = ', this.data);
    this.resourceService = resourceService;
  }


  public onAction(data, action) {
    console.log('content in space cards = ', data, action);
    // if(this.slug !== 'space' && !(this.userService.loggedIn)){
    // this.clickEvent.emit({ 'action': action, 'data': data });
    // } else {
      if (this.slug === 'space') {
    this.router.navigate(['resources/player/content/', data.identifier]);
      }
    // }
  }

}
