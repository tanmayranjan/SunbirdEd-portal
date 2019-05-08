import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedTenantResolverService {

  private themingConfig : any;
  private _tenantData = null;
  
  public tenantData$ = new BehaviorSubject<object>(this._tenantData);
  public tenantData = this.tenantData$.asObservable();
  
  constructor(private http: HttpClient) { }

  public setTenantConfig(configData : object) {
    this._tenantData = configData;
    this.tenantData$.next(this._tenantData);
    console.log("I recieved tenant data like this ",this._tenantData);
    
  }

  /* public getTenantThemeData() {
    if(this.tenantData$.value !== null){
      return this.tenantData;
    } else {
      console.log("received no tenant data like it ");
      //return nothing
    }
    
  } */

updateTheme() {
  console.log('update theme has the following data ', this._tenantData);
    //let theme = JSON.parse(this._tenantData);
    if(this._tenantData !== undefined || this._tenantData !== null){
      let primaryColor = this._tenantData['CustomizeOptions']['Home']['theme']['primaryColor'];
      console.log('theme data is ', this._tenantData['CustomizeOptions']['Home']['theme']['primaryColor']);
      document.documentElement.style.setProperty('--primary-color',primaryColor);
    }else {
      alert('did not recieve any theme');
    }
  }

  getTenantInfo() {
  // inject the router manualy to read the current route and make decisions
  //this.router = this.injector.get(Router);

  //this.themingConfig = localStorage.getItem('theming');
  if (this._tenantData == undefined || this._tenantData == null) {

        const tenanturl = (Math.floor(Math.random() * (+3 - +1)) + +1) === 1 ? 'https://api.myjson.com/bins/11pgw2': 'https://api.myjson.com/bins/1gvhfw';
        const option = {
          url : tenanturl,
        }
        this.http.get(option.url).pipe(take(1))
        .subscribe(response => {
          if(response){
            console.log('Recieved something in the RESOLVER');
            console.log(response);
            this.setTenantConfig(response);
            //localStorage.setItem('theming', JSON.stringify(response));
            //this.themingConfig = response;
            this._tenantData = response;
            this.updateTheme();
          }else {
            console.log('rejected the RESOLVER')
            localStorage.removeItem('theming');
          }
        });
    }
    else {
        //alert('we detected the configuration');
        //this.themingConfig  = JSON.parse(localStorage.getItem('theming'));
        if(this._tenantData == undefined || this._tenantData == null){
          alert('did not recieve any configuration');
        } else {
          //this._tenantData = this.themingConfig;
          console.log('here is the configuration ',this._tenantData);
          this.updateTheme();
        }
      }
  }

  getTenantThemeConfig(configName ?: string) {
    let theme = this._tenantData;
    if(theme !== undefined){
      if(configName && configName.length > 0){
        return theme['CustomizeOptions'][configName];
      } else {
        return theme['CustomizeOptions'];
      }
    } else {
      alert('no theme config found');
    }
  }
}
