import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { ActivatedRoute } from '@angular/router';
import { PublicDataService } from '@sunbird/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-preview-page',
  templateUrl: './preview-page.component.html',
  styleUrls: ['./preview-page.component.css']
})
export class PreviewPageComponent implements OnInit {
  contentId;
  courseDetails = [];
  constructor(
    public activatedRoute: ActivatedRoute,
    public configService: ConfigService,
    public publicDataService: PublicDataService
  ) {}

  ngOnInit() {
    this.contentId = this.activatedRoute.snapshot.params.collectionId;
    this.getCourseDetails();
  }
  getCourseDetails() {
    const req = {
      url: `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${this.contentId}`
    };
    this.publicDataService.get(req).subscribe(data => {
      if (data.result.content.hasOwnProperty('children')) {
      const childrenIds = data.result.content.children;
      _.forOwn(childrenIds, childrenvalue => {
        this.getChildren(childrenvalue);
      });
    }
    });
  }
getChildren(sessiondetails) {
_.forOwn(sessiondetails, (children, key) => {
    if (key === 'children') {
       _.forOwn(children, value => {
         if (key === 'children') {
           this.getChildren(value);
    if (value.hasOwnProperty('children')) {
      console.log(value);
      if (value.children.length === 0 )  {
        this.courseDetails.push(value);
        console.log(this.courseDetails);
      }
      }
         }
        });
    }

});

}
}
