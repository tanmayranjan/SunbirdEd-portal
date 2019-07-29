import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-people-invloved',
  templateUrl: './people-invloved.component.html',
  styleUrls: ['./people-invloved.component.css']
})
export class PeopleInvlovedComponent implements OnInit {
  modalRef: any;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    sessionStorage.clear();
  }
  openSm(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

}
