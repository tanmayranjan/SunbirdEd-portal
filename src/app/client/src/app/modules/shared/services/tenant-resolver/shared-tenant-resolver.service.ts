import { Injectable, Injector, ReflectiveInjector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { TenantResolverService } from '../../../public/services/TenantResolver/tenant-resolver.service';
import { CookieManagerService } from '../cookie-manager/cookie-manager.service';
import { SharedUserService } from '../sharedUser/shared-user.service';

@Injectable({
  providedIn: 'root',
})
export class SharedTenantResolverService {

  private _tenantData = null;
  public tenantData$ = new BehaviorSubject<object>(this._tenantData);
  public tenantData = this.tenantData$.asObservable();

  constructor(private mockservice: TenantResolverService, private cookieSrvc: CookieManagerService, private userSrvc: SharedUserService) {
   }

  public setTenantConfig(configData: object) {
    debugger;
    this._tenantData = configData['value'];
    this.tenantData$.next(this._tenantData);
    // localStorage.setItem('theming', JSON.stringify(configData['value']));
    this.cookieSrvc.setCookie('theming', JSON.stringify(configData['value']));
    console.log('I recieved tenant data like this ', this._tenantData);
  }

  updateTheme() {
    if (this._tenantData !== undefined || this._tenantData !== null) {
      const primaryColor = this._tenantData['tenantPreferenceDetails']['Home']['theme']['primaryColor'];
      const secondaryColor = this._tenantData['tenantPreferenceDetails']['Home']['theme']['secondaryColor'];
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    } else {
      alert('did not recieve any theme');
    }
  }

  getTenantInfo() {
    // let themedata =localStorage.getItem('theming');
    let themedata = this.cookieSrvc.getCookie('theming');
    let userid =(<HTMLInputElement>document.getElementById('userId'))? (<HTMLInputElement>document.getElementById('userId')).value : null;
    let tenantUrl = (<HTMLInputElement>document.getElementById('tenantUrl')).value;
    if(userid === null) {
      if(localStorage.getItem('logout') === 'true'){
        this.reloadInfo();
        localStorage.removeItem('logout');
        return;
      }
      if (!!themedata) {
        // let localStorageConfig = JSON.parse(themedata) || null;
        let localStorageConfig = JSON.parse(this.cookieSrvc.getCookie('theming')) || null;
        if (localStorageConfig !== null && localStorageConfig['homeUrl'] === tenantUrl) {
          console.log('no need to update localStorage');
        } else {
           console.log('need to update localstorage');
          this.mockservice.getMockTenant().pipe(take(1))
            .subscribe(response => {
              if (response) {
                console.log('Recieved something in the RESOLVER');
                console.log(response);
                this.setTenantConfig(response);
                //  localStorage.setItem('theming', JSON.stringify(response));
                //  this.themingConfig = response;
                //  this._tenantData = response;
                this.updateTheme();
              } else {
                console.log('rejected the RESOLVER');
                // localStorage.removeItem('theming');
                this.cookieSrvc.setCookie('theming', '', 0);
              }
            });
        }
        console.log('got in localStorage');
        // this._tenantData = JSON.parse(localStorage.getItem('theming'));
        this._tenantData = JSON.parse(this.cookieSrvc.getCookie('theming'));
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
              this.updateTheme();
            } else {
              console.log('rejected the RESOLVER');
              // localStorage.removeItem('theming');
              this.cookieSrvc.setCookie('theming', '', 0);
            }
          });
      }
    } else {
      let loggedUserOrgID = '';
      //  user is logged in , check for orgId of the user
      this.userSrvc.getLoggedInOrganisation();
      this.userSrvc.userData$.subscribe(userOrgId => {
        debugger;
        if(!!userOrgId) {
          loggedUserOrgID = userOrgId['orgId'];
          console.log(loggedUserOrgID);
          // loggedUserOrgID = userOrgId;
          if(!!loggedUserOrgID) {
            //did not find any cookie storing the orgId, load the default one

          } else {
            // a user from different domain may have logged in
            this.compareUser(loggedUserOrgID);
          }
        }
      });
      //const loggedUserOrgID = this.cookieSrvc.getCookie('x-user-org-id');
      /* if(!!!loggedUserOrgID) {
        //did not find any cookie storing the orgId, load the default one

      } else {
        // a user from different domain may have logged in
        this.compareUser(loggedUserOrgID);
      } */
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

  compareUser(loggedInOrgID: string) {
    //let localData = localStorage.getItem('theming');
    let localData = this.cookieSrvc.getCookie('theming');
    if(JSON.parse(localData)['orgid'] === loggedInOrgID) {
      // user belongs from the same domain
      console.log('initial tenant', this._tenantData);

      // this._tenantData = JSON.parse(localStorage.getItem('theming'));
      this._tenantData = JSON.parse(this.cookieSrvc.getCookie('theming'));
      this.updateTheme();
      this.tenantData$.next(this._tenantData);
    
    } else {
      //  user logged in to different domain, update the theme to user specific domain
      this.mockservice.getMockDataonID(loggedInOrgID).pipe(take(1)).subscribe( newThemeData => {
        if(newThemeData) {
          // localStorage.setItem('theming', JSON.stringify(newThemeData));
          this.cookieSrvc.setCookie('theming', JSON.stringify(newThemeData));
          // now update the theme with new data
          this._tenantData = JSON.parse(this.cookieSrvc.getCookie('theming'));
          this.updateTheme();
          this.tenantData$.next(this._tenantData);
        }
      }, err => {
        console.log('did not get any theme data while updating for different user');
        console.log(err);
      });
    }
  }

  reloadInfo() {
    debugger;
    console.log("reloaded");
        this._tenantData = JSON.parse(this.cookieSrvc.getCookie('theming'));
        this.updateTheme();
        this.tenantData$.next(this._tenantData);
  }
}
