import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import { DataService } from '../../../core/services/data/data.service';
import {ConfigService } from './../config/config.service';
@Injectable({
  providedIn: 'root'
})
export class SharedUserService {

  private userid: string;
  private _userData = new BehaviorSubject<object>(undefined);

  public userData$: Observable<object> = this._userData.asObservable();

  constructor( private dataSrvc: DataService, private config: ConfigService) {

   }

  public getLoggedInOrganisation() {
    this.userid = (<HTMLInputElement>document.getElementById('userId')).value;
    console.log('user id is ', this.userid);
    const option = {
      url: `${this.config.urlConFig.URLS.USER.GET_PROFILE}${this.userid}`,
      param: this.config.urlConFig.params.userReadParam,
      userOrgForTenant: true
    };
    /* const option = {
      url: `user/v2/read/${this.userid}`}; */
    this.dataSrvc.get(option).subscribe(
      (data) => {
        debugger;
        console.log('user data ', data['rootOrg']['hashTagId']);
        this._userData.next({orgId: data['rootOrg']['hashTagId']});
      },
      (err) => {
        debugger;
        this._userData.next({error : err});
      }
    );
  }
}
