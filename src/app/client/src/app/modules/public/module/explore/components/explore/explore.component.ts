import { OfflineFileUploaderService } from '../../../../../offline/services';
import { combineLatest, Subject } from 'rxjs';
import { PageApiService, OrgDetailsService, UserService } from '@sunbird/core';
import { PublicPlayerService } from './../../../../services';
import { Component, OnInit, OnDestroy, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import {
  ResourceService, ToasterService, INoResultMessage, ConfigService, UtilService, ICaraouselData,
  BrowserCacheTtlService, NavigationHelperService
} from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata, IImpressionEventInput } from '@sunbird/telemetry';
import { takeUntil, map, mergeMap, first, filter } from 'rxjs/operators';
import { CacheService } from 'ng2-cache-service';
import { environment } from '@sunbird/environment';
// import { open } from 'fs';
@Component({
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit, OnDestroy, AfterViewInit {

  public showLoader = true;
  public showLoginModal = false;
  public baseUrl: string;
  public noResultMessage: INoResultMessage;
  public carouselMasterData: Array<ICaraouselData> = [];
  public filterType: string;
  public queryParams: any;
  public hashTagId: string;
  public unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  public inViewLogs = [];
  public sortIntractEdata: IInteractEventEdata;
  public dataDrivenFilters: any = {};
  public dataDrivenFilterEvent = new EventEmitter();
  public initFilters = false;
  public loaderMessage;
  public pageSections: Array<ICaraouselData> = [];
  public slug;
  isOffline: boolean = environment.isOffline;
  public paramType = [
    'assetType',
    'focusArea',
    'organization',
    'region',
    'gradeLevel',
    'topic',
    'board',
    'channel',
    'languages',
    'country'
  ];

  @HostListener('window:scroll', []) onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 2 / 3)
      && this.pageSections.length < this.carouselMasterData.length) {
      this.pageSections.push(this.carouselMasterData[this.pageSections.length]);
    }
  }
  constructor(private pageApiService: PageApiService, private toasterService: ToasterService,
    public offlineFileUploaderService: OfflineFileUploaderService,
    public resourceService: ResourceService, private configService: ConfigService, private activatedRoute: ActivatedRoute,
    public router: Router, private utilService: UtilService, private orgDetailsService: OrgDetailsService,
    private publicPlayerService: PublicPlayerService, private cacheService: CacheService,
    private browserCacheTtlService: BrowserCacheTtlService, private userService: UserService,
    public navigationhelperService: NavigationHelperService) {
    this.router.onSameUrlNavigation = 'reload';
    this.filterType = this.configService.appConfig.explore.filterType;
  }

  ngOnInit() {
    this.orgDetailsService.getOrgDetails(this.activatedRoute.snapshot.params.slug).pipe(
      mergeMap((orgDetails: any) => {
        console.log('org details form explore component = ', orgDetails);
        this.slug = orgDetails.slug;
        this.hashTagId = orgDetails.hashTagId;
        this.initFilters = true;
        return this.dataDrivenFilterEvent;
      }), first()
    ).subscribe((filters: any) => {
      this.dataDrivenFilters = filters;
      this.fetchContentOnParamChange();
      this.setNoResultMessage();
    },
      error => {
        this.router.navigate(['']);
      }
    );

    if (this.isOffline) {
      const self = this;
      this.offlineFileUploaderService.isUpload.subscribe(() => {
        self.fetchPageData();
      });
    }
  }
  public getFilters(filters) {
    const defaultFilters = _.reduce(filters, (collector: any, element) => {
      if (element.code === 'board') {
        collector.board = _.get(_.orderBy(element.range, ['index'], ['asc']), '[0].name') || '';
      }
      return collector;
    }, {});
    this.dataDrivenFilterEvent.emit(defaultFilters);
  }
  private fetchContentOnParamChange() {
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams).pipe(
      takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.showLoader = true;
        this.queryParams = { ...result[1] };
        this.carouselMasterData = [];
        this.pageSections = [];
        this.fetchPageData();
      });
  }
  private fetchPageData() {
   if (this.slug !== 'space') {
    //  console.log('in explore page');
    const filters = _.pickBy(this.queryParams, (value: Array<string> | string, key) => {
      if (_.includes(['sort_by', 'sortType', 'appliedFilters'], key)) {
        return false;
      }
      return value.length;
    });
    const softConstraintData = {
      filters: {
        channel: this.hashTagId,
        board: [this.dataDrivenFilters.board]
      },
      // softConstraints: _.get(this.activatedRoute.snapshot, 'data.softConstraints'),
      mode: 'soft'
    };
    const manipulatedData = this.utilService.manipulateSoftConstraint(_.get(this.queryParams, 'appliedFilters'),
      softConstraintData);
    const option = {
      source: 'web',
      name: 'Explore',
      filters: _.get(this.queryParams, 'appliedFilters') ? filters : _.get(manipulatedData, 'filters'),
      mode: _.get(manipulatedData, 'mode'),
      exists: [],
      params: this.configService.appConfig.ExplorePage.contentApiQueryParams
    };
    if (_.get(manipulatedData, 'filters')) {
      option['softConstraints'] = _.get(manipulatedData, 'softConstraints');
    }
    /*
    adding channel code in the filters to show relevant courses only

    change made by RISHABH KALRA, NIIT LTD on 12-06-2019
    */
   option.filters['channel'] = [this.hashTagId];

    this.pageApiService.getPageData(option)
      .subscribe(data => {
        this.showLoader = false;
        this.carouselMasterData = this.prepareCarouselData(_.get(data, 'sections'));
        if (!this.carouselMasterData.length) {
          return; // no page section
        }
        if (this.carouselMasterData.length >= 2) {
          this.pageSections = [this.carouselMasterData[0], this.carouselMasterData[1]];
        } else if (this.carouselMasterData.length >= 1) {
          this.pageSections = [this.carouselMasterData[0]];
        }
      }, err => {
        this.showLoader = false;
        this.carouselMasterData = [];
        this.pageSections = [];
        this.toasterService.error(this.resourceService.messages.fmsg.m0004);
      });
   } else {
    const filters = _.pickBy(this.queryParams, (value: Array<string> | string, key) => {
      if (_.includes(['sort_by', 'sortType', 'appliedFilters'], key)) {
        return false;
      }
      return value.length;
    });
    const softConstraintData = {
      filters: {
        board: []
      },
      mode: 'soft'
    };
    const manipulatedData = this.utilService.manipulateSoftConstraint(_.get(this.queryParams, 'appliedFilters'),
      softConstraintData);
    const option = {
      source: 'web',
      name: 'Explore',
      // filters: _.get(this.queryParams, 'appliedFilters') ? filters : _.get(manipulatedData, 'filters'),
      filters: {
        organisation: this.configService.appConfig.ExplorePage.orgName,
        region: [],
        contentType: [],
        status: ['Live'],
        board: [],
        channel: [],
        gradeLevel: [],
        topic: [],
        languages: [],
        country: [],
        creators: []
      },
      mode: _.get(manipulatedData, 'mode'),
      exists: [],
      params: this.configService.appConfig.ExplorePage.contentApiQueryParams
    };
    if (_.get(manipulatedData, 'filters')) {
      option['softConstraints'] = _.get(manipulatedData, 'softConstraints');
    }
    /*
    adding channel code in the filters to show relevant courses only

    change made by RISHABH KALRA, NIIT LTD on 12-06-2019
    */
   console.log('q params in explore page = ', this.queryParams);
  option.filters.organisation = this.configService.appConfig.ExplorePage.orgName;
  this.paramType.forEach(param => {
    if (this.queryParams.hasOwnProperty(param)) {
      if (param === 'board') {
        option.filters.board = this.queryParams[param];
      }
      if (param === 'organization') {
        option.filters.organisation = this.queryParams[param];
      }
      if (param === 'channel') {
        option.filters.creators = this.queryParams[param];
      }
      if (param === 'country') {
        option.filters.region = this.queryParams[param];
      }
      if (param === 'gradeLevel') {
        option.filters.gradeLevel = this.queryParams[param];
      }
      if (param === 'topic') {
        option.filters.topic = this.queryParams[param];
      }
      if (param === 'languages') {
        option.filters.languages = this.queryParams[param];
      }
      // if (param === 'country') {
      //   option.filters.country = this.queryParams[param];
      // }

      this.callingPageApi(option);
    }
  });
this.callingPageApi(option);
   }
  }
  callingPageApi(option) {
    this.pageApiService.getPageData(option)
    .subscribe(data => {
      this.showLoader = false;
      this.carouselMasterData = this.prepareCarouselData(_.get(data, 'sections'));
      if (!this.carouselMasterData.length) {
        return; // no page section
      }
      if (this.carouselMasterData.length >= 2) {
        this.pageSections = [this.carouselMasterData[0], this.carouselMasterData[1]];
      } else if (this.carouselMasterData.length >= 1) {
        this.pageSections = [this.carouselMasterData[0]];
      }
    }, err => {
      this.showLoader = false;
      this.carouselMasterData = [];
      this.pageSections = [];
      this.toasterService.error(this.resourceService.messages.fmsg.m0004);
    });
  }
  private prepareCarouselData(sections = []) {
    const { constantData, metaData, dynamicFields, slickSize } = this.configService.appConfig.ExplorePage;
    const carouselData = _.reduce(sections, (collector, element) => {
      const contents = _.slice(_.get(element, 'contents'), 0, slickSize) || [];
      element.contents = this.utilService.getDataForCard(contents, constantData, dynamicFields, metaData);
      if (element.contents && element.contents.length) {
        collector.push(element);
      }
      return collector;
    }, []);
    return carouselData;
  }
  public prepareVisits(event) {
    _.forEach(event, (inView, index) => {
      if (inView.metaData.identifier) {
        this.inViewLogs.push({
          objid: inView.metaData.identifier,
          objtype: inView.metaData.contentType,
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
    if (!this.userService.loggedIn && event.data.contentType === 'Course') {
      this.showLoginModal = true;
      this.baseUrl = '/' + 'learn' + '/' + 'course' + '/' + event.data.metaData.identifier;
    } else {
      this.publicPlayerService.playContent(event);
    }
  }
  public viewAll(event) {
    const searchQuery = JSON.parse(event.searchQuery);
    const softConstraintsFilter = {
      board: [this.dataDrivenFilters.board],
      channel: this.hashTagId,
    };
    searchQuery.request.filters.defaultSortBy = JSON.stringify(searchQuery.request.sort_by);
    searchQuery.request.filters.softConstraintsFilter = JSON.stringify(softConstraintsFilter);
    searchQuery.request.filters.exists = searchQuery.request.exists;
    this.cacheService.set('viewAllQuery', searchQuery.request.filters);
    this.cacheService.set('pageSection', event, { maxAge: this.browserCacheTtlService.browserCacheTtl });
    const queryParams = { ...searchQuery.request.filters, ...this.queryParams };
    const sectionUrl = this.router.url.split('?')[0] + '/view-all/' + event.name.replace(/\s/g, '-');
    this.router.navigate([sectionUrl, 1], { queryParams: queryParams });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.setTelemetryData();
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private setTelemetryData() {
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        duration: this.navigationhelperService.getPageLoadTime()
      }
    };
    this.sortIntractEdata = {
      id: 'sort',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };
  }
  private setNoResultMessage() {
    this.noResultMessage = {
      'message': 'messages.stmsg.m0007',
      'messageText': 'messages.stmsg.m0006'
    };
  }
}
