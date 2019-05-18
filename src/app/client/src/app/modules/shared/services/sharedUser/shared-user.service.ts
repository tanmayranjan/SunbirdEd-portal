import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import { DataService } from '../../../core/services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class SharedUserService {

  private userid: string;
  
  constructor( private dataSrvc: DataService) {

   }

  public getLoggedInOrganisation(): Observable<any> {
    this.userid = (<HTMLInputElement>document.getElementById('userid')).value;
    console.log('user id is ', this.userid);
    const option = {
      url: `user/v2/read/${this.userid}`,
      param: {
        fields: 'completeness,missingFields,lastLoginTime,organisations,roles'}
    };
    debugger;
    this.dataSrvc.get(option).subscribe(
      (data) => {
        console.log("user data ", data);
      },
      (err) => {
        debugger;
      }
    );
 return of({});
  }
}
