import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationHelperService } from '@sunbird/shared';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { Router } from '@angular/router';

@Component({
  selector: 'app-people-invloved',
  templateUrl: './people-invloved.component.html',
  styleUrls: ['./people-invloved.component.css']
})
export class PeopleInvlovedComponent implements OnInit {
  telemetryImpression: IImpressionEventInput;
  modalRef: any;
  constructor(private modalService: NgbModal,
    public route: Router,
    public navigationhelperService: NavigationHelperService) { }

  ngOnInit() {
    sessionStorage.clear();
    /*telemetry inplementation for space*/
    this.telemetryImpression = {
      context: {
        env: 'collaborators'
      },
      edata: {
        type: 'view',
        pageid: 'collaborators',
        uri: this.route.url,
        subtype: 'paginate',
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
    /*telemetry inplementation for space*/
  }
  openSm(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

}
