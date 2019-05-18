import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import { DataService } from '../../../core/services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class SharedUserService {

  private userid: string;
  private _userData = new BehaviorSubject<object>(undefined);
  
  public userData$: Observable<object> = this._userData.asObservable();

  constructor( private dataSrvc: DataService) {

   }

  public getLoggedInOrganisation() {
    this.userid = (<HTMLInputElement>document.getElementById('userId')).value;
    console.log('user id is ', this.userid);
    const option = {
      url: `user/v2/read/${this.userid}`};
    this.dataSrvc.get(option).subscribe(
      (data) => {
        debugger;
        console.log("user data ", data);
        this._userData.next(data);
      },
      (err) => {
        debugger;
        this._userData.next({error : err});
      }
    );
  }
}
