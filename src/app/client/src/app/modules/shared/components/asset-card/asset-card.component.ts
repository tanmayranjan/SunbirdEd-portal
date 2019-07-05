import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ICard } from '../../interfaces';
import { IImpressionEventInput, IInteractEventObject } from '@sunbird/telemetry';
import { ResourceService } from '../../services/index';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss']
})
export class AssetCardComponent implements OnInit {

  @Input() data: ICard;
  @Input() dialCode: string;
  @Input() customClass: string;
  @Output() clickEvent = new EventEmitter<any>();
  telemetryCdata: Array<{}> = [];

  constructor(public resourceService: ResourceService) {
    this.resourceService = resourceService;
    if (this.dialCode) {
      this.telemetryCdata = [{ 'type': 'dialCode', 'id': this.dialCode }];
    }
  }

  ngOnInit() {
    console.log('assets from cards = ', this.data);
  }

  convertToString(data) {
    console.log('content data ', data);
    if (_.isArray(data)) {
      return data.join();
    } else {
      return data;
    }

  }
  openLink(link) {
    window.open(link, '_blank');
  }
}
