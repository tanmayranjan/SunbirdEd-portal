import { ResourceService } from '../../services/index';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';

@Component({
  selector: 'app-enrolled-card',
  templateUrl: './enrolled-card.component.html',
  styleUrls: ['./enrolled-card.component.scss']
})
export class EnrolledCardComponent implements OnInit {
  /**
* content is used to render IContents value on the view
*/
  @Input() data: ICard;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();
  progress;
  constructor(public resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  public onAction(data, action) {
    console.log(this.resourceService);
    console.log(data, action);
    this.clickEvent.emit({ 'action': action, 'data': data });
  }

  ngOnInit() {
    console.log(this.data.progress);
    console.log('recieved data ', this.data);
  }


}
