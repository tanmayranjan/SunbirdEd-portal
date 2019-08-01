import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-partners-sunbird',
  templateUrl: './partners-sunbird.component.html',
  styleUrls: ['./partners-sunbird.component.scss'],
})
export class PartnersSunbirdComponent implements OnInit {
  modalRef: any;
  modalopen = false;
  constructor() { }

  ngOnInit() {
    sessionStorage.clear();
  }
  // openSm(content) {
  //   this.modalRef = this.modalService.open(content, { size: 'lg' });
  // }
  openmodal() {
    this.modalopen = true;
  }
}
