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
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit  {
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
     name: 'Professional'
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
  queryParam: any = {};
  key: string;
  search: object;

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
    this.fetchPageData();
  }
  private fetchPageData() {
    const filters = {
      contentType : ['TextBook']
    };
    const option: any = {
      source: 'web',
      name: 'explore_Popular_OnDemand_Courses',
      filters: filters,
      params : this.configService.appConfig.CoursePageSection.contentApiQueryParams
    };
    this.pageApiService.getPageData(option).pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        console.log('pagedata', data);
        _.forOwn(data, value => {
   _.forEach(value , course => {
     console.log('value' , course);
   this.carouselData.push(course);

   });
        });
        console.log('carousel', this.carouselData);
        this.showLoader = false;
      }, err => {
        this.showLoader = false;
        this.carouselData = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0002);
    });
  }

  public prepareVisits(event) {
    console.log('inside orepare visits');
    _.forEach(event, (inView, index) => {
      if (inView.metaData.identifier) {
        this.inViewLogs.push({
          objid: inView.metaData.identifier,
          objtype: 'course',
          index: index,
          section: inView.section,
        });
      } else if (inView.metaData.courseId) {
        this.inViewLogs.push({
          objid: inView.metaData.courseId,
          objtype: 'course',
          index: index,
          section: inView.section,
        });
      }
    });
    this.telemetryImpression.edata.visits = this.inViewLogs;
    this.telemetryImpression.edata.subtype = 'pageexit';
    this.telemetryImpression = Object.assign({}, this.telemetryImpression);
  }
  public playContent(event) {
    if (event.data.metaData.batchId) {
      event.data.metaData.mimeType = 'application/vnd.ekstep.content-collection';
      event.data.metaData.contentType = 'Course';
    }
    this.playerService.playContent(event.data.metaData);
  }
  public viewAll(event) {
    const searchQuery = JSON.parse(event.searchQuery);
    // searchQuery.request.filters.channel = this.hashTagId;
    // searchQuery.request.filters.board = this.prominentFilters.board;
    const searchQueryParams: any = {};
    _.forIn(searchQuery.request.filters, (value, key) => {
      if (_.isPlainObject(value)) {
        searchQueryParams.dynamic = JSON.stringify({[key]: value});
      } else {
        searchQueryParams[key] = value;
      }
    });
    searchQueryParams.defaultSortBy = JSON.stringify(searchQuery.request.sort_by);
    searchQueryParams.exists = searchQuery.request.exists;
    this.cacheService.set('viewAllQuery', searchQueryParams, { maxAge: this.browserCacheTtlService.browserCacheTtl });
    const queryParams = { ...searchQueryParams, ...this.queryParams};
    const sectionUrl = this.router.url.split('?')[0] + '/view-all/' + event.name.replace(/\s/g, '-');
    this.router.navigate([sectionUrl, 1], {queryParams: queryParams});
  }
  blockAngleChar(key) {
    console.log('event', key);
   this.key = key;
    this.queryParam = {};
    this.queryParam['key'] = this.key;
    if (this.key && this.key.length > 0) {
      console.log('inside if', this.key);
            this.queryParam['key'] = this.key;
    } else {
      console.log('inside else', this.key);
      delete this.queryParam['key'];
    }
    this.search = this.configService.dropDownConfig.FILTER.SEARCH.search;
    this.router.navigate([this.search['Courses'], 1], {
      queryParams: this.queryParam
    });
  }
}
