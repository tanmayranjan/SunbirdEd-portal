import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserstatusService {
  public _checklogginstatus = new BehaviorSubject<boolean>(false);
  checklogginstatus$ = this._checklogginstatus.asObservable();
  
  constructor() { }

  public setloggin(flag) {
    this._checklogginstatus.next(flag);
  }
}
