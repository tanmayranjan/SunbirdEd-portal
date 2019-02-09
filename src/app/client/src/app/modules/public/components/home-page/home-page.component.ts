import {combineLatest, of, Subject } from 'rxjs';
import { PageApiService, CoursesService, ISort, PlayerService, FormService } from '@sunbird/core';
import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import {
  ResourceService, ServerResponse, ToasterService, ICaraouselData, ConfigService, UtilService, INoResultMessage, BrowserCacheTtlService
} from '@sunbird/shared';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { takeUntil, map, mergeMap, first, filter, catchError } from 'rxjs/operators';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit  {
   /**

  /**
   * Contains result object returned from getPageData API.
   */
  categors;
  categoryNames = [];
  categories = [1, 2, 3, 4, 5, 6];
  popularcourses = [
   {
     background : 'http://niittvimgcdn.azureedge.net/Images/anytime_graphic.jpg',
     name: 'Anytime Courses'
   },
   {
   background : 'http://niittvimgcdn.azureedge.net/Images/testpreparation.jpg',
   name: 'Test Preparation',
  }

  ];
  images = [
  // tslint:disable-next-line: max-line-length

   {
     background: 'http://niittvimgcdn.azureedge.net/Images/school_graphic.jpg',
     name: 'School'
   },
   {
  // tslint:disable-next-line: max-line-length
     background: 'http://niittvimgcdn.azureedge.net/Images/collage_graphic.jpg',
     name: 'College'
   },
   {
  // tslint:disable-next-line: max-line-length
     background: 'http://niittvimgcdn.azureedge.net/Images/managemnt_graphic.jpg',
     name: 'Management'
   },
   {
  // tslint:disable-next-line: max-line-length
     background: 'http://niittvimgcdn.azureedge.net/Images/IT_graphic.jpg',
     name: 'IT'
   },
   {
     background: 'http://niittvimgcdn.azureedge.net/Images/banking_graphic.jpg',
     name: 'Banking'
   },
   {
     background: 'http://niittvimgcdn.azureedge.net/Images/wrkPro_graphic.jpg',
     name: 'Working Professional'
   }
  ];
  public showLoader = true;
  public noResultMessage: INoResultMessage;
  public carouselData: Array<ICaraouselData> = [];
  public filterType: string;
  public queryParams: any;
  public hashTagId: string;
  public unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  public inViewLogs = [];
  public sortIntractEdata: IInteractEventEdata;
  public dataDrivenFilters: any = {};
  public dataDrivenFilterEvent = new EventEmitter();
  public frameWorkName: string;
  public initFilters = false;
  public loaderMessage;
  public sortingOptions: ISort;
  public enrolledSection: any;
  public redirectUrl: string;

  constructor(private pageApiService: PageApiService, private toasterService: ToasterService,
    public resourceService: ResourceService, private configService: ConfigService, private activatedRoute: ActivatedRoute,
    public router: Router, private utilService: UtilService, public coursesService: CoursesService,
    private playerService: PlayerService, private cacheService: CacheService,
    private browserCacheTtlService: BrowserCacheTtlService, public formService: FormService) {
    this.redirectUrl = this.configService.appConfig.courses.inPageredirectUrl;
    this.filterType = this.configService.appConfig.courses.filterType;
    this.sortingOptions = this.configService.dropDownConfig.FILTER.RESOURCES.sortingOptions;
  }
  ngOnInit() {
    const filters =  {
      objectType: 'Content',
      contentType: ['TextBook', 'Resource']
      };
    console.log('filter', filters);
    const option: any = {
      source: 'web',
      name: 'explore_home',
      filters: filters,
      // softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 },
      // mode: 'soft',
      // exists: [],
      params : this.configService.appConfig.CoursePageSection.contentApiQueryParams
    };
    // if (this.queryParams.sort_by) {
    //   option.sort_by = {[this.queryParams.sort_by]: this.queryParams.sortType  };
    // }
    this.pageApiService.getPageData(option).pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        console.log('datad', data);
       _.forEach(data, pagedata => {
         console.log(pagedata);
       });
        console.log(this.carouselData);
        this.showLoader = false;
      }, err => {
        console.log('error in service', err);
        this.showLoader = false;
        this.carouselData = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0002);
    });
  }
}
