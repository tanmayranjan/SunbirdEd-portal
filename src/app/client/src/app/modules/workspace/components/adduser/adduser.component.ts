import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {
  route: Router;
showbulkupload =  false;
singleUser = false;
  constructor( route: Router) {
    this.route = route;
   }

  ngOnInit() {
  }
adduser(event) {
 if (event.target.name === 'bulk') {
  this.showbulkupload = !this.showbulkupload;
 }
  console.log('inside func' , event.target.name);
}
addSingleUser() {
// this.route.navigate(['addSingleUser']);
this.singleUser = !this.singleUser;
}
}
