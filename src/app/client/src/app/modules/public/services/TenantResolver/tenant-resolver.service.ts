import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SharedTenantResolverService } from '../../../shared/services/tenant-resolver/shared-tenant-resolver.service';
@Injectable({
  providedIn: 'root'
})
/**
 * This resolver is used to get the initial tenant configuration
 * and then set all the details to the localstorage for the complete
 * application to work. The infotmation fetche by the resolver includes
 * homepage theming styles and content for a particular tenant layout
 */
export class TenantResolverService {
  constructor(private http: HttpClient, private injector: Injector, private sharedTenantResolver: SharedTenantResolverService) { }

  private router: any;
  private themingConfig: any;

  updateTheme() {
    console.log('update theme has the following data ', this.themingConfig);
    const theme = JSON.parse(this.themingConfig);
    if (theme !== undefined || theme !== null) {
      const primaryColor = theme['CustomizeOptions']['Home']['theme']['primaryColor'];
      console.log('theme data is ', theme['CustomizeOptions']['Home']['theme']['primaryColor']);
      document.documentElement.style.setProperty('--primary-color', primaryColor);
    } else {
      alert('did not recieve any theme');
    }
  }

  getTenantInfo() {
    // inject the router manualy to read the current route and make decisions
    // this.router = this.injector.get(Router);

    // this.themingConfig = localStorage.getItem('theming');
    if (window.location.href === 'http://localhost:3000/') {
      alert('making fresh request');

      const tenanturl = (Math.floor(Math.random() * (+3 - +1)) + +1) === 1 ? 'https://api.myjson.com/bins/lmnm4' : 'https://api.myjson.com/bins/1gvhfw';
      const option = {
        url: tenanturl,
      };
      this.http.get(option.url).pipe(take(1)).subscribe(response => {
        if (response) {
          debugger;
          console.log('Recieved something in the RESOLVER');
          console.log(response);
          this.sharedTenantResolver.setTenantConfig(response);
          localStorage.setItem('theming', JSON.stringify(response));
          this.themingConfig = response;
          this.updateTheme();
        } else {
          console.log('rejected the RESOLVER');
          localStorage.removeItem('theming');
        }
      });
    } else {
      // alert('we detected the configuration');
      this.themingConfig = localStorage.getItem('theming');
      if (this.themingConfig == undefined || this.themingConfig == null) {
        alert('did not recieve any configuration');
      } else {

        console.log('here is the configuration ', this.themingConfig);
        alert('recieved configuration');
        this.updateTheme();
      }
    }
  }

  getTenantThemeConfig(configName?: string) {
    const theme = JSON.parse(this.themingConfig);
    if (theme !== undefined) {
      if (configName.length > 0) {
        return theme['CustomizeOptions']['Home'];
      }
    } else {
      throw Error('No them object found');
    }
  }
}
