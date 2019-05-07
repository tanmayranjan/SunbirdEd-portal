import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedTenantResolverService {

  private _tenantData = null;
  public tenantData$ = new BehaviorSubject<object>(this._tenantData);
  public tenantData = this.tenantData$.asObservable();
  
  public setTenantConfig(configData : object) {
    debugger;
    this._tenantData = configData;
    this.tenantData$.next(this._tenantData);
    alert('tenantResover working');
    console.log("I recieved tenant data like this ",this._tenantData);
    
  }

  public getTenantThemeData() {
    if(this.tenantData$.value !== null){
      return this.tenantData;
    } else {
      console.log("received no tenant data like it ");
      return of({});
    }
    
  }
  constructor() { }
}
