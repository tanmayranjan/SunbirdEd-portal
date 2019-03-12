import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.css']
})
export class CreateBatchComponent implements OnInit {
  @ViewChild('modal') modal;
  today = new Date();
  endDate = new Date(this.today.getTime() + (24 * 60 * 60 * 1000));
@Input() courseId;
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    console.log(this.courseId);
  }
createBatch() {

}
goToCreate() {
  this.router.navigate(['/workspace/content/allcontent', 1]);
}
}
