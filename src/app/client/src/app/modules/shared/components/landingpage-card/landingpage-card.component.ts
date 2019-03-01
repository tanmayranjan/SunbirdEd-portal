import { ResourceService } from '../../services/index';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';

@Component({
  selector: 'app-landingpage-card',
  templateUrl: './landingpage-card.component.html',
  styleUrls: ['./landingpage-card.component.scss']
})
export class LandingpageCardComponent {
  /**
* content is used to render IContents value on the view
*/
  @Input() data: ICard;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();

  constructor(public resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  public onAction(data, action) {
    this.clickEvent.emit({ 'action': action, 'data': data });
  }
}
