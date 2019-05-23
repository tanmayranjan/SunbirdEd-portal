import { Injectable, Injector, ReflectiveInjector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, forkJoin } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { TenantResolverService } from '../../../public/services/TenantResolver/tenant-resolver.service';
import { CookieManagerService } from '../cookie-manager/cookie-manager.service';
import { SharedUserService } from '../sharedUser/shared-user.service';

@Injectable({
  providedIn: 'root',
})
export class SharedTenantResolverService {

  public _tenantData = false;
  public tenantData$ = new BehaviorSubject<any>(this._tenantData);
  public tenantData = this.tenantData$.asObservable();

  constructor(private mockservice: TenantResolverService, private cookieSrvc: CookieManagerService, private userSrvc: SharedUserService) {
  }

  public setTenantConfig(configData: object) {
    this._tenantData = configData['value'];
    // localStorage.setItem('theming', JSON.stringify(configData['value']));
    this.cookieSrvc.setCookie('theming', JSON.stringify(configData['value']));
    this.tenantData$.next(this._tenantData);
    // // console.log('I recieved tenant data like this ', this._tenantData);
  }

  updateTheme() {
    if (!!this._tenantData) {
      const primaryColor = this._tenantData['tenantPreferenceDetails']['Home']['theme']['primaryColor'];
      const secondaryColor = this._tenantData['tenantPreferenceDetails']['Home']['theme']['secondaryColor'];
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    } else {
      console.log('did not recieve any theme');
      return of(false);
    }
  }

  getTenantInfo(): Observable<string | boolean> {
    const themedata = this.cookieSrvc.getCookie('theming');
    let userid;

    if (<HTMLInputElement>document.getElementById('userId')) {
      userid = (<HTMLInputElement>document.getElementById('userId')).value;
    } else {
      userid = null;
    }
    const tenantUrl = (<HTMLInputElement>document.getElementById('tenantUrl')).value;
    // check if user is logged in or not

    if (userid === null) {
      if (performance.navigation.type === 1) {
        console.log('reload');
        // localStorage.setItem('reload', JSON.stringify(true));
        this.reloadInfo();
        return of(true);
       } else if (localStorage.getItem('logout') === 'true') {
        console.log('post logout');
        this.reloadSameConfig();
        return of(true);
      } else if (!!themedata) {
        // let localStorageConfig = JSON.parse(themedata) || null;
        const localStorageConfig = JSON.parse(themedata) || null;
        if (!!localStorageConfig && localStorageConfig['homeUrl'] !== tenantUrl) {
          // // console.log('need to update localstorage');
          this.mockservice.getMockTenant().pipe(take(1))
            .subscribe(response => {
              if (response) {
                // // console.log('Recieved something in the RESOLVER');
                // // console.log(response);
                this.setTenantConfig(response);
                this.updateTheme();
              } else {
                // // console.log('rejected the RESOLVER');
                this.cookieSrvc.setCookie('theming', '', 0);
                return of(false);
              }
            });
        }
        this._tenantData = JSON.parse(this.cookieSrvc.getCookie('theming'));
        this.updateTheme();
        this.tenantData$.next(this._tenantData);
        return of(true);
      } else {
        // console.log('actual request');
        return this.mockservice.getMockTenant().pipe(map(response => {
          if (response) {
            // console.log('Recieved something in the RESOLVER');
            // console.log(response);
            this.setTenantConfig(response);
            this.updateTheme();
            return true;
          } else {
            // console.log('rejected the RESOLVER');
            localStorage.removeItem('theming');
            this.cookieSrvc.setCookie('theming', '', 0);
            return false;
          }
        }));
      }
    } else {
      //  user is logged in , check for orgId of the user
      return this.userSrvc.getLoggedInOrganisation();
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
    // let localData = localStorage.getItem('theming');
    const localData = this.cookieSrvc.getCookie('theming');
    let localDataJSON;
    if (!!localData) {
      localDataJSON = JSON.parse(localData);

      if (localDataJSON['orgid'] === loggedInOrgID) {
        // user belongs from the same domain
        // // console.log('initial tenant', this._tenantData);

        // this._tenantData = JSON.parse(localStorage.getItem('theming'));
        this._tenantData = localDataJSON;
        this.updateTheme();
        this.tenantData$.next(this._tenantData);
        return of(true);
      } else {
        //  user logged in to different domain, update the theme to user specific domain
        return of(false);
      }
    } else {
      return of(false);
    }
  }

  reloadSameConfig() {
    this.reloadInfo();
    localStorage.removeItem('logout');
  }

  reloadInfo() {
    this._tenantData = this.cookieSrvc.getCookie('theming') ? JSON.parse(this.cookieSrvc.getCookie('theming')) : null;
    this.updateTheme();
    this.tenantData$.next(this._tenantData);
  }

  setInitialRequirements() {
    const initialData = {
      themedata: this.cookieSrvc.getCookie('theming'),
      userid: (<HTMLInputElement>document.getElementById('userId')) ? (<HTMLInputElement>document.getElementById('userId')).value : null,
      tenantUrl: (<HTMLInputElement>document.getElementById('tenantUrl')).value
    };
    return of(initialData);
  }
}
