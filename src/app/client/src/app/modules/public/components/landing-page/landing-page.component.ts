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
import {TelemetryService} from '../../../telemetry/services/telemetry/telemetry.service';
import {OrgDetailsService} from '@sunbird/core';
import { IUserProfile, IUserData } from '@sunbird/shared';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services';
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

  images = [
  // tslint:disable-next-line: max-line-length

   {
     background: 'http://niittvimgcdn.azureedge.net/Images/school_graphic.jpg',
     name: 'School',
     frameWork: 'rating'
   },
   {
  // tslint:disable-next-line: max-line-length
     background: 'http://niittvimgcdn.azureedge.net/Images/collage_graphic.jpg',
     name: 'College' ,
     frameWork: 'board'
   },
   {
  // tslint:disable-next-line: max-line-length
     background: 'http://niittvimgcdn.azureedge.net/Images/managemnt_graphic.jpg',
     name: 'Management',
     frameWork: 'medium'
   },
   {
  // tslint:disable-next-line: max-line-length
     background: 'http://niittvimgcdn.azureedge.net/Images/IT_graphic.jpg',
     name: 'IT' ,
     frameWork: 'gradeLevel'
   },
   {
     background: 'http://niittvimgcdn.azureedge.net/Images/banking_graphic.jpg',
     name: 'Banking' ,
     frameWork: 'subject'
   },
   {
     background: 'http://niittvimgcdn.azureedge.net/Images/wrkPro_graphic.jpg',
     name: 'Professional' ,
     frameWork: 'topic'
   }
  ];
  userDataSubscription: Subscription;
  public userService: UserService;
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
     private orgDetailsService: OrgDetailsService, userService: UserService ,
    private playerService: PlayerService, private cacheService: CacheService, private telemetry: TelemetryService ,
    private browserCacheTtlService: BrowserCacheTtlService, public formService: FormService) {
    this.redirectUrl = this.configService.appConfig.courses.inPageredirectUrl;
    this.filterType = this.configService.appConfig.courses.filterType;
    this.userService = userService;
    this.sortingOptions = this.configService.dropDownConfig.FILTER.RESOURCES.sortingOptions;
  }
  ngOnInit() {
    // if (!this.userService.loggedIn) {
    //   console.log('logged in', this.userService.loggedIn);    }
  //  this.userService.userData$.subscribe(
  //     (user: IUserData) => {
  //       console.log('user', user);
  //       if (user && !user.err) {
  //         console.log('inside if true');
  //         // this.userProfile = user.userProfile;
  //       }
  //     });
  // tslint:disable-next-line:no-unused-expression
 console.log('path', this.activatedRoute.snapshot.data.orgdata.defaultFramework);
    this.fetchPageData();
  }
  private fetchPageData() {
    const filters = {
      contentType : ['TextBook' , 'Resources'],
    };
    const option: any = {
      source: 'web',
      name: 'home-popularCourses',
      filters: filters,
      params : this.configService.appConfig.CoursePageSection.contentApiQueryParams
    };
    console.log('params', this.configService.appConfig.CoursePageSection.contentApiQueryParams);
    this.pageApiService.getPageData(option).pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        _.forOwn(data, value => {
   _.forEach(value , course => {
   this.carouselData.push(course);

   });
        });
        this.showLoader = false;
      }, err => {
        this.showLoader = false;
        this.carouselData = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0002);
    });
  }

  public prepareVisits(event) {
    // console.log('inside orepare visits');
    _.forEach(event, (inView, index) => {
      if (inView.identifier) {
        this.inViewLogs.push({
          objid: inView.identifier,
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
            this.queryParam['key'] = this.key;
    } else {
      delete this.queryParam['key'];
    }
    this.search = this.configService.dropDownConfig.FILTER.SEARCH.search;
    if (this.userService.loggedIn) {
      this.router.navigate(['/search/explore-course', 1], {
        queryParams: this.queryParam
    },
    );
  } else {
    console.log('log', this.queryParam);
    this.router.navigate(['/search/explore-course', 1], {
      queryParams: this.queryParam
      // queryParams: {
      //   key: key ,
      //   frameWork: this.activatedRoute.snapshot.data.orgdata.defaultFramework ,
      //   rootOrg: this.activatedRoute.snapshot.data.orgdata.rootOrgId}
    });
  }
  }
  scroll() {
    console.log('inside scroll');
document.getElementById('GoToPopularCourses').click();
// element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
  getFramework(framework, name) {
console.log('framework', framework);
const key = { key : framework};
this.router.navigate(['/search/explore-course', 1], {
  queryParams: key
});
  }
}
