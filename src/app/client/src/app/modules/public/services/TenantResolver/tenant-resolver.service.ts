import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {take } from 'rxjs/operators';
import {HttpClient } from '@angular/common/http';
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
  constructor( private http: HttpClient, private injector : Injector) {}
  

  private router : any;
  private themingConfig : any;

updateTheme() {
    let theme = JSON.parse(this.themingConfig);
    if(theme !== undefined || theme !== null){
      //alert('recieved the theme');
      let primaryColor = theme['CustomizeOptions']['Home']['theme']['primaryColor'];
      // let primaryColor = 'green'
      console.log('theme data is ', theme['CustomizeOptions']['Home']['theme']['primaryColor']);
      //this.body = this.vcr.element.nativeElement.parentElement;
      //let body = document.getElementsByTagName('body');
      document.documentElement.style.setProperty('--primary-color',primaryColor);
      //this.vcr.element.nativeElement.parentElement.classList.add(primaryColor);
      //console.log('the body is very body ', this.body);
    }else {
      alert('did not recieve any theme');
    }
  }

  getTenantInfo() {
  // inject the router manualy to read the current route and make decisions
  this.router = this.injector.get(Router);
  console.log(this.router);
  this.themingConfig = localStorage.getItem('theming');
  if (this.router.isActive('/') && (this.themingConfig == undefined || this.themingConfig == null)) {
        alert('no theming config detected, making fresh request');
        const option = {
          url : 'https://api.myjson.com/bins/1grijg',
        }
        this.http.get(option.url).pipe(take(1)).subscribe(response => {
          if(response){
            console.log('Recieved something in the RESOLVER');
            localStorage.setItem('theming', JSON.stringify(response));
          }else {
            console.log('rejected the RESOLVER')
            localStorage.removeItem('theming');
          }
        });
      }
      else if (this.router.isActive('/') && (this.themingConfig !== undefined && this.themingConfig !== null)) {
        alert('we detected the configuration');
        console.log('here is the configuration ',this.themingConfig);
      }
  }

  getTenantThemeConfig(configName ?: string) {
    let theme = JSON.parse(this.themingConfig);
    if(theme !== undefined){
      if(configName.length > 0){
        return theme['CustomizeOptions']['Home'];
      }
    } else {
      throw Error('No them object found');
    }
  }
}