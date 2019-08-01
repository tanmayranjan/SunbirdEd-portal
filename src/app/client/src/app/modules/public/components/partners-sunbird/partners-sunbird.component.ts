import { Component, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'ng2-semantic-ui/dist';

@Component({
  selector: 'app-partners-sunbird',
  templateUrl: './partners-sunbird.component.html',
  styleUrls: ['./partners-sunbird.component.scss'],
})
export class PartnersSunbirdComponent implements OnInit {
  @ViewChild('modal')
  public modal: Modal<{ data: string }, string, string>;
  modalRef: any;
  modalopen = false;
  constructor() { }

  ngOnInit() {
    sessionStorage.clear();
    this.modalopen = false;
  }
  openmodal() {
    this.modalopen = !this.modalopen;
  }
 close() {
   console.log('modal = ', this.modal);
 this.modal.deny('true');
 }
}
