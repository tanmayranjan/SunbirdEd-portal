import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { TenantResolverService } from '../../../public/services/TenantResolver/tenant-resolver.service';

@Injectable({
  providedIn: 'root'
})
export class SharedTenantResolverService {

  private _tenantData = null;

  public tenantData$ = new BehaviorSubject<object>(this._tenantData);
  public tenantData = this.tenantData$.asObservable();

  constructor(private mockservice: TenantResolverService) { }

  public setTenantConfig(configData: object) {
    this._tenantData = configData['value'];
    this.tenantData$.next(this._tenantData);
    localStorage.setItem('theming', JSON.stringify(configData['value']));
    console.log('I recieved tenant data like this ', this._tenantData);
  }

  /* public getTenantThemeData() {
    if(this.tenantData$.value !== null){
      return this.tenantData;
    } else {
      console.log("received no tenant data like it ");
      // return nothing
    }

  } */

  updateTheme() {
    // console.log('update theme has the following data ', this._tenantData);
    // let theme = JSON.parse(this._tenantData);
    if (this._tenantData !== undefined || this._tenantData !== null) {
      const primaryColor = this._tenantData['tenantPreferenceDetails']['Home']['theme']['primaryColor'];
      const secondaryColor = this._tenantData['tenantPreferenceDetails']['Home']['theme']['secondaryColor'];
      // console.log('theme data is ', this._tenantData['CustomizeOptions']['Home']['theme']['primaryColor']);
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    } else {
      alert('did not recieve any theme');
    }
  }

  getTenantInfo() {
    if (localStorage.getItem('theming') && localStorage.getItem('theming') !== 'undefined') {

      const localStorageConfig = JSON.parse(localStorage.getItem('theming')) || null;
      if (localStorageConfig !== null && localStorageConfig['homeUrl'] === (<HTMLInputElement>document.getElementById('tenantUrl')).value) {
        console.log('no need to update localStorage');
      } else {
         console.log('need to update localstorage');
        this.mockservice.getMockTenant().pipe(take(1))
          .subscribe(response => {
            if (response) {
              console.log('Recieved something in the RESOLVER');
              console.log(response);
              this.setTenantConfig(response);
              // localStorage.setItem('theming', JSON.stringify(response));
              // this.themingConfig = response;
              // this._tenantData = response;
              this.updateTheme();
            } else {
              console.log('rejected the RESOLVER');
              localStorage.removeItem('theming');
            }
          });
      }
      console.log('got in localStorage');
      this._tenantData = JSON.parse(localStorage.getItem('theming'));
      this.updateTheme();
      this.tenantData$.next(this._tenantData);
    } else {
      console.log('actual request');
        this.mockservice.getMockTenant().pipe(take(1))
        .subscribe(response => {
          if (response) {
            console.log('Recieved something in the RESOLVER');
            console.log(response);
            this.setTenantConfig(response);
            // localStorage.setItem('theming', JSON.stringify(response));
            // this.themingConfig = response;
            // this._tenantData = response;
            this.updateTheme();
          } else {
            console.log('rejected the RESOLVER');
            localStorage.removeItem('theming');
          }
        });
    }
  }

  getTenantThemeConfig(configName?: string) {
    const theme = this._tenantData;
    if (theme !== undefined) {
      if (configName && configName.length > 0) {
        return theme['tenantPreferenceDetails'][configName];
      } else {
        return theme['tenantPreferenceDetails'];
      }
    } else {
      alert('no theme config found');
    }
  }
}
