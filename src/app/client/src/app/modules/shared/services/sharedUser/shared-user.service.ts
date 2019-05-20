import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { skipWhile, map } from 'rxjs/operators';
import { DataService } from '../../../core/services/data/data.service';
import { ConfigService } from '../config/config.service';
@Injectable({
  providedIn: 'root'
})
export class SharedUserService {

  private userid: string;
  public userData$ = new BehaviorSubject<object>(undefined);
  // private _userData: Observable<object> = this.userData$.asObservable();

  constructor( private dataSrvc: DataService, private configSrvc: ConfigService) {

   }

  public getLoggedInOrganisation(): Observable<any> {
    this.userid = (<HTMLInputElement>document.getElementById('userId')).value;
    // console.log('user id is ', this.userid);
    const option = {
      url: `${this.configSrvc.urlConFig.URLS.USER.GET_PROFILE}${this.userid}`,
      param: this.configSrvc.urlConFig.params.userReadParam,
      userOrgForTenant: true
    };
    return this.dataSrvc.get(option).pipe(map(data => {
      if (data !== undefined && data.result.response.hasOwnProperty('rootOrg')) {
        // console.log('recieved user data ');
        return data.result.response['rootOrg']['hashTagId'];
      }
    }));
  }
}
