import { combineLatest, of, Subject } from 'rxjs';
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
import { TelemetryService } from '../../../telemetry/services/telemetry/telemetry.service';
import { OrgDetailsService, SearchService } from '@sunbird/core';
import { IUserProfile, IUserData } from '@sunbird/shared';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services';
import { FrameworkService } from './../../../core/services/framework/framework.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  /**
 /**
  * Contains result object returned from getPageData API.
  */
  categors;
  categoryNames = [];
  categories = [1, 2, 3, 4, 5, 6];
  popularcourses = [
    {
      background: 'http://niittvimgcdn.azureedge.net/Images/anytime_graphic.jpg',
      name: 'Anytime Courses'
    },
    {
      background: 'http://niittvimgcdn.azureedge.net/Images/testpreparation.jpg',
      name: 'Test Preparation',
    }

  ];
  images = [
    // tslint:disable-next-line: max-line-length

    {
      background: '../../../../../assets/fa/development.png',
      name: 'Web Development',
      frameWork: 'rating'
    },
    {
      // tslint:disable-next-line: max-line-length
      background: '../../../../../assets/fa/Design.png',
      name: 'Financial Management',
      frameWork: 'board'
    },
    {
      // tslint:disable-next-line: max-line-length
      background: '../../../../../assets/fa/personal-dev.png',
      name: 'Marketing',
      frameWork: 'medium'
    },
    {
      // tslint:disable-next-line: max-line-length
      background: '../../../../../assets/fa/ITandSoft.png',
      name: 'IT',
      frameWork: 'gradeLevel'
    },
    {
      background: '../../../../../assets/fa/marketing.png',
      name: 'Personal Developement',
      frameWork: 'subject'
    },
    {
      background: '../../../../../assets/fa/business.png',
      name: 'Management',
      frameWork: 'topic'
    },
    {
      background: '../../../../../assets/fa/data-science.png',
      name: 'Business',
      frameWork: 'topic'
    },
    {
      background: '../../../../../assets/fa/personal-dev.png',
      name: 'Data Science',
      frameWork: 'medium'
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
  selectedSection = 'Data Science';
  queryParam: any = {};
  key: string;
  search: object;

  constructor(private pageApiService: PageApiService, private toasterService: ToasterService,
    public resourceService: ResourceService, private configService: ConfigService, private activatedRoute: ActivatedRoute,
    public router: Router, private utilService: UtilService, public coursesService: CoursesService,
    private orgDetailsService: OrgDetailsService, userService: UserService,
    private playerService: PlayerService, private cacheService: CacheService, private telemetry: TelemetryService,
    private browserCacheTtlService: BrowserCacheTtlService, public formService: FormService,
    private frameworkService: FrameworkService, private searchservice: SearchService) {
    this.redirectUrl = this.configService.appConfig.courses.inPageredirectUrl;
    this.filterType = this.configService.appConfig.courses.filterType;
    this.userService = userService;
    this.sortingOptions = this.configService.dropDownConfig.FILTER.RESOURCES.sortingOptions;
  }
  ngOnInit() {
    // set the active class behaviour in  the navtabs of popular section
    jQuery(document).ready(() => {
      console.log('jQuery loaded');
      (<any>jQuery('.carousel')).carousel({
        interval: 5000
      });
    });
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
    this.frameWorkName = this.activatedRoute.snapshot.data.orgdata.defaultFramework;
    this.fetchPageData();
  }
  private fetchPageData() {
    const filters = {
      contentType: ['TextBook', 'Resources'],

    };
    const option: any = {
      source: 'web',
      name: 'home-popularCourses',
      filters: filters,
      params: this.configService.appConfig.CoursePageSection.contentApiQueryParams
    };
    console.log('params', this.configService.appConfig.CoursePageSection.contentApiQueryParams);
    this.pageApiService.getPageData(option).pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        _.forOwn(data, value => {
          _.forEach(value, course => {
            console.log(course.name);
            //this.update_carousel('Data Science', 'gradeLevel');
            this.carouselData.push(course);
            console.log(course, this.carouselData);

          });
        });
        this.showLoader = false;
        debugger;
      }, err => {
        this.showLoader = false;
        this.carouselData = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0002);
      });
    // get the framework categories
    this.frameworkService.getFrameworkCategories(this.frameWorkName)
      .subscribe(frameworkData => {
        console.log('framework categories', frameworkData.result.framework.categories);
        this.categoryNames = frameworkData.result.framework.categories.filter(category => category.code === 'gradeLevel');
        console.log('grade level categories created as ', this.categoryNames);
        this.categoryNames = this.categoryNames.map(category => {
          return category.terms.splice(0, 8);
        });
        console.log('mapped category names are ', this.categoryNames);
        // this.categoryNames[0] = this.categoryNames.splice(0, 8);
        // console.log('category names filled as ', this.categoryNames);
        // add images to the specified ategories
        this.categoryNames[0].forEach(category => {
          this.images.filter(imageData => {
            if (imageData['name'] === category['name']) {
              category['imageUrl'] = imageData.background;
              return imageData.background;
            }
          });
        });
      }, err => {
        console.log('error occured while getting framework categories', err);
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
    console.log(event);
    if (event.data.metaData.batchId) {
      event.data.metaData.mimeType = 'application/vnd.ekstep.content-collection';
      event.data.metaData.contentType = 'Course';
    }
    this.playerService.playContent(event.data.metaData);
    this.router.navigate(['play/collection'], event.data.identifier);
  }
  public viewAll(event) {
    const searchQuery = JSON.parse(event.searchQuery);
    const searchQueryParams: any = {};
    _.forIn(searchQuery.request.filters, (value, key) => {
      if (_.isPlainObject(value)) {
        searchQueryParams.dynamic = JSON.stringify({ [key]: value });
      } else {
        searchQueryParams[key] = value;
      }
    });
    searchQueryParams.defaultSortBy = JSON.stringify(searchQuery.request.sort_by);
    searchQueryParams.exists = searchQuery.request.exists;
    this.cacheService.set('viewAllQuery', searchQueryParams, { maxAge: this.browserCacheTtlService.browserCacheTtl });
    const queryParams = { ...searchQueryParams, ...this.queryParams };
    const sectionUrl = this.router.url.split('?')[0] + '/view-all/' + event.name.replace(/\s/g, '-');
    this.router.navigate([sectionUrl, 1], { queryParams: queryParams });
  }
  scroll() {
    console.log('inside scroll');
    document.getElementById('GoToPopularCourses').click();
    // element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  blockAngleChar(key) {
    if (key === '' || key === null || key === undefined) {
      this.toasterService.error('Plese Enter value to Search');
    } else {
      this.key = key;
      this.queryParam = {};
      this.queryParam['key'] = this.key;
      if (this.key && this.key.length > 0) {
        this.queryParam['key'] = this.key;
      } else {
        delete this.queryParam['key'];
      }
      this.search = this.configService.dropDownConfig.FILTER.SEARCH.search;
      this.router.navigate(['/search/explore-course', 1], {
        queryParams: this.queryParam
      });
      //   if (this.userService.loggedIn) {
      //     this.router.navigate(['/search/explore-course', 1], {
      //       queryParams: this.queryParam
      //   },
      //   );
      // } else {
      //   console.log('log', this.queryParam);
      //   this.router.navigate(['/search/explore-course', 1], {
      //     queryParams: this.queryParam
      //   });
      // }
    }

  }
  getFramework(framework, name) {
    console.log('framework', framework, name);

    const key = {
      [framework]: name
    };
    console.log(key);
    this.router.navigate(['/search/explore-course', 1], {
      queryParams: key
    });
  }

  update_carousel(keyword, frameworkCategory) {
    this.selectedSection = keyword;
    const request = {};
    request['filters'] = {
      'contentType': ['Course']
    };
    request['filters'][frameworkCategory] = [keyword];
    this.searchservice.contentSearch(request, false).subscribe(response => {
      console.log(response);
      if (response.result.count <= 0) {
        console.log('no results found');
        this.carouselData['0']['contents'] = [];
        console.log(this.carouselData);
      } else {
        // empty the data and refill with new content
        /**
         * this is a temporary fix because name is mandatory to pass in popular couse interface.
         * to improve the reusability, name is set same as keyword enterd for search
         */
        this.carouselData = [];
        this.carouselData['0'] = [];
        this.carouselData['0']['name'] = keyword;
        this.carouselData['0']['contents'] = response.result.content;
        console.log(this.carouselData);

      }
    }, err => {
      console.log('an error occured while getting the selected content');
      console.error(err);
    });
    //this.activate(clickEvent);
  }

  activate(event) {
    const currentEl = jQuery(event.target);
    const parent = jQuery(event.target).parent().children();
    // tslint:disable-next-line:only-arrow-functions
    jQuery.each(parent, function(key, child) {
      jQuery(child).removeClass('active');
    });
    if (!currentEl.hasClass('active')) {
      currentEl.addClass('active');
    }
    console.log('parent clicked is ', parent);
  }
}
