import { ConfigService } from '@sunbird/shared';
import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CollectionHierarchyAPI } from '../../interfaces';
import { PublicDataService } from './../public-data/public-data.service';
import { ContentService } from '../content/content.service';

@Injectable({
  providedIn: 'root'
})
export class AssetService extends DataService {
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
  public http: HttpClient;
  /**
   * constructor
   * @param {ConfigService} config ConfigService reference
   * @param {HttpClient} http HttpClient reference
   */
  constructor(config: ConfigService, http: HttpClient, private publicService: PublicDataService, public content: ContentService) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
  }
  getupForAssetReviewData(filterOptions) {
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
    return this.publicService.reviewAsset(option);
  }
  update(inputParams) {
    const option = {
      url: `${this.config.urlConFig.URLS.ASSET.UPDATEASSET}/${inputParams.asset.identifier}`,
      data: {
        'request': inputParams
    }
  };
    return this.content.update(option);
  }

  create(inputParams) {
    const option = {
      url: this.config.urlConFig.URLS.ASSET.CREATEASSET,
      data: {
        'request': inputParams
    }
  };
    return this.content.create(option);
  }
  read(inputParams) {
    return this.content.read(inputParams);
  }
}
