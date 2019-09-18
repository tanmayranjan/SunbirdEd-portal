import { of, throwError } from 'rxjs';
import { first, mergeMap, map, tap, catchError, filter } from 'rxjs/operators';
import {
  ConfigService, ResourceService, Framework, BrowserCacheTtlService
} from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FrameworkService, FormService, PermissionService, UserService, OrgDetailsService } from './../../services';
import * as _ from 'lodash-es';
import { CacheService } from 'ng2-cache-service';
import { IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-space-data-driven-filter',
  templateUrl: './space-data-driven-filter.component.html',
  styleUrls: ['./space-data-driven-filter.component.scss']
})
export class SpaceDataDrivenFilterComponent implements OnInit, OnChanges {
  @Input() filterEnv: string;
  @Input() accordionDefaultOpen: boolean;
  @Input() isShowFilterLabel: boolean;
  @Input() hashTagId: string;
  @Input() ignoreQuery = [];
  @Input() showSearchedParam;
  @Input() enrichFilters: object;
  @Input() viewAllMode = false;
  @Input() pageId: string;
  @Input() frameworkName: string;
  @Input() formAction: string;
  @Output() dataDrivenFilter = new EventEmitter();

  frame = 'framework';
  topic = 'topic';

  public showFilters = false;

  public formFieldProperties: Array<any>;

  public filtersDetails: Array<any>;

  public categoryMasterList: Array<any>;

  public framework: string;
  public channelInputLabel: any;

  public formInputData: any;

  public refresh = true;

  public isShowFilterPlaceholder = true;

  public filterIntractEdata: IInteractEventEdata;

  public submitIntractEdata: IInteractEventEdata;
  placeholder = '';
  constructor(public configService: ConfigService, public resourceService: ResourceService, public router: Router,
    private activatedRoute: ActivatedRoute, private cacheService: CacheService, private cdr: ChangeDetectorRef,
    public frameworkService: FrameworkService, public formService: FormService,
    public userService: UserService, public permissionService: PermissionService,
    private browserCacheTtlService: BrowserCacheTtlService, private orgDetailsService: OrgDetailsService) {
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit() {

    console.log('hashtag id = ', this.userService.hashTagId);
    this.frameworkService.initialize(this.frameworkName, this.hashTagId);
    this.getFormatedFilterDetails().subscribe((formFieldProperties) => {
      console.log('form filed properties = ', formFieldProperties);
      let temp;
      temp = formFieldProperties[2].range;
      temp.splice(2, 1);
      this.formFieldProperties = formFieldProperties;
      this.filtersDetails = _.cloneDeep(formFieldProperties);
      this.dataDrivenFilter.emit(formFieldProperties);
      this.subscribeToQueryParams();
    }, (err) => {
      this.dataDrivenFilter.emit([]);
    });
    this.setFilterInteractData();
  }
  getFormatedFilterDetails() {
    const formAction = this.formAction ? this.formAction : 'search';
    return this.fetchFrameWorkDetails().pipe(
      mergeMap((frameworkDetails: any) => {
        console.log('details = ', frameworkDetails);
        this.categoryMasterList = frameworkDetails.categoryMasterList;
        this.framework = frameworkDetails.code;
        return this.getFormDetails();
      }),
      mergeMap((formData: any) => {
        if (_.find(formData, { code: 'channel' })) {
          return this.getOrgSearch().pipe(map((channelData: any) => {
            const data = _.filter(channelData, 'hashTagId');
            console.log('channel data = ', channelData, formData);
            return { formData: formData, channelData: data };
          }));
        } else {
          return of({ formData: formData });
        }
      }),
      map((formData: any) => {
        let formFieldProperties = _.filter(formData.formData, (formFieldCategory) => {
          if (!_.isEmpty(formFieldCategory.allowedRoles)
            && !this.permissionService.checkRolesPermissions(formFieldCategory.allowedRoles)) {
            return false;
          }
          if (formFieldCategory.code === 'channel') {
            formFieldCategory.range = _.map(formData.channelData, (value) => {
              return {
                category: 'channel',
                identifier: value.hashTagId,
                name: value.orgName,
              };
            });
          } else if (formFieldCategory.code === 'languages') {
            let id = 1;
            formFieldCategory.range = _.map(this.configService.countryConfig.default.languages, (value) => {
              return {
                category: 'languages',
                identifier: id++,
                name: value,
              };
            });
          } else if (formFieldCategory.code === 'country') {
            let id = 1;
            formFieldCategory.range = _.map(this.configService.countryConfig.default.countries, (value) => {
              return {
                category: 'country',
                identifier: id++,
                name: value,
              };
            });
          } else {
            const loggedInUserRoles = _.get(this.userService, 'userProfile.userRoles');
            const frameworkTerms = _.get(_.find(this.categoryMasterList, { code: formFieldCategory.code }), 'terms');
            formFieldCategory.range = _.union(formFieldCategory.range, frameworkTerms);
            if (this.filterEnv === 'upforreview' && formFieldCategory.code === 'contentType' &&
              (_.includes(loggedInUserRoles, 'CONTENT_REVIEWER') && _.includes(loggedInUserRoles, 'BOOK_REVIEWER') &&
                !_.find(formFieldCategory.range, { name: 'TextBook' }))) {
              formFieldCategory.range.push({ name: 'TextBook' });
            }
          }
          return true;
        });
        formFieldProperties = _.sortBy(_.uniqBy(formFieldProperties, 'code'), 'index');
        return formFieldProperties;
      }));
  }
  private fetchFrameWorkDetails() {
    return this.frameworkService.frameworkData$.pipe(filter((frameworkDetails) => { // wait to get the framework name if passed as input
      console.log('framework details = ', frameworkDetails );
      if (!frameworkDetails.err) {
        const framework = this.frameworkName ? this.frameworkName : 'defaultFramework';
        const frameworkData = _.get(frameworkDetails.frameworkdata, framework);
        if (frameworkData) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }), first(),
      mergeMap((frameworkDetails: Framework) => {
        if (!frameworkDetails.err) {
          const framework = this.frameworkName ? this.frameworkName : 'defaultFramework';
          const frameworkData = _.get(frameworkDetails.frameworkdata, framework);
          console.log('framework data = ', frameworkData );
          if (frameworkData) {
            return of({ categoryMasterList: frameworkData.categories, framework: frameworkData.code });
          } else {
            return throwError('no result for ' + this.frameworkName); // framework error need to handle this
          }
        } else {
          return throwError(frameworkDetails.err); // framework error
        }
      }));
  }
  private subscribeToQueryParams() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.formInputData = {};
      _.forIn(params, (value, key) => this.formInputData[key] = typeof value === 'string' && key !== 'key' ? [value] : value);
      if (params.channel) {
        this.modelChange(this.formInputData.channel);
        this.channelInputLabel = this.orgDetailsService.getOrg();
      }
      this.showFilters = true;
      this.hardRefreshFilter();
    });
  }
  private getFormDetails() {
    const formServiceInputParams = {
      formType: 'content',
      formAction: this.formAction ? this.formAction : 'search',
      contentType: this.filterEnv,
      framework: this.framework
    };
    console.log('frmaework param = ', formServiceInputParams);
    return this.formService.getFormConfig(formServiceInputParams, this.hashTagId);
  }

  public resetFilters() {
    this.formInputData = _.pick(this.formInputData, this.ignoreQuery);
    if (this.viewAllMode) {
      const data = this.cacheService.get('viewAllQuery');
      _.forIn(data, (value, key) => this.formInputData[key] = value);
    }
    this.router.navigate([], { relativeTo: this.activatedRoute.parent, queryParams: this.formInputData });
    this.hardRefreshFilter();
  }

  public applyFilters() {
    const queryParams: any = {};
    _.forIn(this.formInputData, (eachInputs: Array<any | object>, key) => {
      const formatedValue = typeof eachInputs === 'string' ? eachInputs :
        _.compact(_.map(eachInputs, value => typeof value === 'string' ? value : _.get(value, 'identifier')));
        console.log('after clicking apply filter = ', formatedValue);
      if (formatedValue.length) {
        queryParams[key] = formatedValue;
      }
    });
    queryParams['appliedFilters'] = true;
    let redirectUrl; // if pageNumber exist then go to first page every time when filter changes, else go exact path
    if (this.activatedRoute.snapshot.params.pageNumber) { // when using dataDriven filter should this should be verified
      redirectUrl = this.router.url.split('?')[0].replace(/[^\/]+$/, '1');
    } else {
      console.log('apply filter key = ', this.router.url.split('?')[0]);
      redirectUrl = this.router.url.split('?')[0];
    }
    this.router.navigate([redirectUrl], { queryParams: queryParams });
  }

  public removeFilterSelection(field, item) {
    const itemIndex = this.formInputData[field].indexOf(item);
    if (itemIndex !== -1) {
      this.formInputData[field].splice(itemIndex, 1);
      if (field === 'channel') {
        this.channelInputLabel.splice(itemIndex, 1);
      }
      this.formInputData = _.pickBy(this.formInputData);
      this.hardRefreshFilter();
    }
  }
  ngOnChanges() {
    if (this.formFieldProperties && this.enrichFilters) {
     // this.enrichFiltersOnInputChange();
    }
  }
  private enrichFiltersOnInputChange() {
    this.filtersDetails = _.map(this.formFieldProperties, (eachFields) => {
      if (!_.includes(['channel'], eachFields.code)) {
        eachFields.range = _.filter(this.enrichFilters[eachFields.code],
          (field) => _.get(field, 'name') && field.name !== '');
      }
      return eachFields;
    });
    this.hardRefreshFilter();
  }
  public handleTopicChange(topicsSelected) {

    this.formInputData['topic'] = [];
    _.forEach(topicsSelected, (value, index) => {
      this.formInputData['topic'].push(value.name);
    });
    this.cdr.detectChanges();
  }
  public handleGradeLevel(topicsSelected) {

    this.formInputData['gradeLevel'] = [];
    _.forEach(topicsSelected, (value, index) => {
      this.formInputData['gradeLevel'].push(value.name);
    });
    this.cdr.detectChanges();
  }
  private modelChange(data) {
    this.channelInputLabel = [];
    const orgDetails = _.find(this.formFieldProperties, ['code', 'channel']);
    if (orgDetails) {
      _.forEach(data, (value, key) => {
        this.channelInputLabel.push(_.find(orgDetails['range'], { identifier: value }));
        this.orgDetailsService.setOrg(this.channelInputLabel);
      });
    }
  }
  private setFilterInteractData() {
    this.submitIntractEdata = {
      id: 'asset-filter-apply',
      type: 'click',
      pageid: this.pageId,
      subtype: 'filter-apply',
      extra: { filter: this.formInputData }
    };
    this.filterIntractEdata = {
      id: 'filter',
      type: 'click',
      pageid: this.pageId
    };
    this.getAssettype(this.formInputData); /*telemetry implementation for space, setting asset type selection*/
  }
  private hardRefreshFilter() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
  getOrgSearch() {
    return this.orgDetailsService.searchOrgDetails(this.userService.hashTagId).pipe(map(data => (data.content)),
      catchError(err => {
        return [];
      }));
  }

  selectedOption(event) {
    console.log('data evenet', event);
    if (event.length === 0) {
    this.placeholder = 'Select';
    } else {
      this.placeholder = 'Selected';
    }
  }
  /*telemetry implementation for space, setting asset type selection*/
  getAssettype(data) {
      let assetObj;
      const assetType = {
        K: 0,
        P: 0,
        S: 0,
        H: 0,
        D: 0
      };
      assetObj = data;

      if (typeof assetObj === 'object') {
        setTimeout(() => {
          if (assetObj.hasOwnProperty('board')) {
            const assetTypeSelected: Array<any> = assetObj['board'];

            assetTypeSelected.forEach((types: string) => {
              const firstChar = types.charAt(0);
              assetType[firstChar] = 1;
            });
            this.submitIntractEdata['extra']['filter']['assetType'] = assetType;
          }
        }, 10);
      } else {
      }
  }
}
