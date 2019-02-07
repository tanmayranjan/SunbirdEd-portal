import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {
showbulkupload =  false;
  constructor() { }

  ngOnInit() {
  }
adduser(event) {
 if (event.target.name === 'bulk') {
  this.showbulkupload = !this.showbulkupload;
 }
  console.log('inside func' , event.target.name);
}
}
