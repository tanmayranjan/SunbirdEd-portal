import { ActivatedRoute } from '@angular/router';
import { ResourceService } from '../../services/index';
import { Component,  Input, EventEmitter, Output} from '@angular/core';
import {ICaraouselData} from '../../interfaces/caraouselData';
import { OnInit, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { Router} from '@angular/router';
import {UserstatusService} from '../../services/userstatus.service';
@Component({
  selector: 'app-space-page-section',
  templateUrl: './space-page-section.component.html',
  styleUrls: ['./space-page-section.component.scss']
})
export class SpacePageSectionComponent implements OnInit, OnChanges {
  @Input() enable: string;
  inviewLogs = [];
  cardIntractEdata: IInteractEventEdata;
  isResourcePage;
  /**
  * slug input
  */
  @Input() slug: string;
 /**
  * section is used to render ICaraouselData value on the view
  */
  @Input() section: ICaraouselData;
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Output() playEvent = new EventEmitter<any>();
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Output() visits = new EventEmitter<any>();

  @Output() viewAll = new EventEmitter<any>();
  /**
  * This is slider setting
  */

 slideConfig = {
  'slidesToShow': 4,
  'slidesToScroll': 4,
  'responsive': [
    {
      'breakpoint': 2800,
      'settings': {
        'slidesToShow': 6,
        'slidesToScroll': 6
      }
    },
    {
      'breakpoint': 2200,
      'settings': {
        'slidesToShow': 5,
        'slidesToScroll': 5
      }
    },
    {
      'breakpoint': 2000,
      'settings': {
        'slidesToShow': 4,
        'slidesToScroll': 4
      }
    },
    {
      'breakpoint': 1600,
      'settings': {
        'slidesToShow': 3.5,
        'slidesToScroll': 3
      }
    },
    {
      'breakpoint': 1200,
      'settings': {
        'slidesToShow': 3,
        'slidesToScroll': 3
      }
    },
    {
      'breakpoint': 900,
      'settings': {
        'slidesToShow': 2.5,
        'slidesToScroll': 2
      }
    },
    {
      'breakpoint': 750,
      'settings': {
        'slidesToShow': 2,
        'slidesToScroll': 2
      }
    },
    {
      'breakpoint': 660,
      'settings': {
        'slidesToShow': 1.75,
        'slidesToScroll': 1
      }
    },
    {
      'breakpoint': 530,
      'settings': {
        'slidesToShow': 1.25,
        'slidesToScroll': 1
      }
    },
    {
      'breakpoint': 450,
      'settings': {
        'slidesToShow': 1,
        'slidesToScroll': 1
      }
    }
  ],
  infinite: false
};
  /**The previous or next value of the button clicked
   * to generate interact telemetry data */
  btnArrow: string;
  pageid: string;
  find_user: string;
  user: string[];
  openmodal = false;
  flag: boolean;
  constructor(public activatedRoute: ActivatedRoute, public resourceService: ResourceService,
    public router: Router, public userstatus: UserstatusService) {
    this.resourceService = resourceService;
  }
  playContent(event) {

    console.log('event =', event);
    // this.playEvent.emit(event);
    if (this.user[4] === 'explore') {
      this.openmodal = true;
     //  this.router.navigate(['space/explore/player/content/', event.data.identifier]);
    } else {
      this.router.navigate(['resources/player/content/', event.data.identifier]);
    }
    // this.route.navigate(['/play/content', data.identifier]);
  }
  ngOnInit() {
    this.userstatus.checklogginstatus$.subscribe((data) => {
      this.flag = data;
    });
    this.find_user =  window.location.href;
    this.user = this.find_user.split('/');
    console.log('icarousal data = ', this.section, this.user, this.enable);
    const id = _.get(this.activatedRoute, 'snapshot.data.telemetry.env');
    this.pageid = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    if (id && this.pageid) {
      this.cardIntractEdata = {
        id: 'content-card',
        type: 'click',
        pageid: this.pageid
      };
    }
    this.isResourcePage = this.router.url.indexOf('resources') > -1;
  }
  /**
   * get inview  Data
  */
  inview(event) {
    const visitsLength = this.inviewLogs.length;
    const visits = [];
    _.forEach(event.inview, (inview, key) => {
      const content = _.find(this.inviewLogs, (eachContent) => {
        if (inview.data.metaData.courseId) {
          return eachContent.metaData.courseId === inview.data.metaData.courseId;
        } else if (inview.data.metaData.identifier) {
          return eachContent.metaData.identifier === inview.data.metaData.identifier;
        }
      });
      if (content === undefined) {
        inview.data.section = this.section.name;
        this.inviewLogs.push(inview.data);
        visits.push(inview.data);
      }
    });
    if (visits.length > 0) {
      this.visits.emit(visits);
    }
  }
  /**
   * get inviewChange
  */
  inviewChange(contentList, event) {
    const visits = [];
    const slideData = contentList;
    _.forEach(slideData, (slide, key) => {
      const content = _.find(this.inviewLogs, (eachContent) => {
        if (slide.metaData.courseId) {
          return eachContent.metaData.courseId === slide.metaData.courseId;
        } else if (slide.metaData.identifier) {
          return eachContent.metaData.identifier === slide.metaData.identifier;
        }
      });
      if (content === undefined) {
        slide.section = this.section.name;
        this.inviewLogs.push(slide);
        visits.push(slide);
      }
    });
    if (visits.length > 0) {
      this.visits.emit(visits);
    }
  }
  checkSlide(event) {
    if (event.currentSlide < event.nextSlide) {
      this.btnArrow = 'next-button';
    } else if (event.currentSlide > event.nextSlide) {
      this.btnArrow = 'prev-button';
    }
  }
  navigateToViewAll(section) {
    this.viewAll.emit(section);
  }
  ngOnChanges() {
  if (this.section) {
    this.ngOnInit();
  }
  }
}
