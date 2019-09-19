import { ConfigService } from '@sunbird/shared';
import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionHierarchyAPI } from '../../interfaces';
import { PublicDataService } from './../public-data/public-data.service';

/**
 * Service to provides CRUD methods to make content api request by extending DataService.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class ContentService extends DataService {
  /**
   * base Url for content api
   */
  baseUrl: string;
  /**
   * reference of config service.
   */
  public config: ConfigService;
  /**
   * reference of lerner service.
   */
  public _myassetdata = new BehaviorSubject<any>({});
  myassetdata$ = this._myassetdata.asObservable();
  public http: HttpClient;
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http HttpClient reference
   */
  constructor(config: ConfigService, http: HttpClient, private publicService: PublicDataService) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
  }
  getupForReviewData(filterOptions) {
    // this function is responsible to get the reviewForUp courses to be desplayed in case of RootOrg reviewer
    const option: any = {
      url: filterOptions.url,
      param: filterOptions.params,
      data: {
        request:
        {
          'query': filterOptions.query || '',
          'filters': filterOptions.filters || {},
          'sort_by': filterOptions.sort_by || {}
          }
    }
    };
    // send the actual request
    return this.publicService.post(option);
  }

  getMyassetPageData(data){
   this._myassetdata.next(data); 
  }

}
