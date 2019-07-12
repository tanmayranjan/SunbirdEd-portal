import { ResourceService } from '../../services/index';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
import {Router} from '@angular/router';

@Component({
  selector: 'app-space-card',
  templateUrl: './space-card.component.html',
  styleUrls: ['./space-card.component.scss']
})
export class SpaceCardComponent  {

  @Input() data: ICard;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();

  constructor(public resourceService: ResourceService, public router: Router) {
    console.log('content in space cards = ', this.data);
    this.resourceService = resourceService;

  }


  public onAction(data, action) {
    console.log('content in space cards = ', data);
    this.clickEvent.emit({ 'action': action, 'data': data });
    // this.router.navigate(['/play/content', data.identifier]);
  }

}