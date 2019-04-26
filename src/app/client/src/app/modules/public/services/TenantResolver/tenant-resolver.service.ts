import { Injectable, Injector } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import {PublicDataService } from './../../../core/services/public-data/public-data.service';
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
  // fetch the tenantData as soon as the user comes from the allocated url, 
  // fetch the organization id, send it to the tenant api and get the initial tenant configuration
  // set all the configuration either in the localStorage or the sharable service for the complete application to use

  /* getTenantInfo(){
    console.log('current route detected is -> ');
    this.publicService.getTenantInfo().then(response => {
      console.log('Resolver on the play');
      console.log("This is the tenant info",response);
      localStorage.setItem('theming', JSON.stringify(response));
      return response;
    }, err => {
      console.log('Resolver not on the play');
      console.log('Tenant info failed to comply', err);
    });
  } */


getTenantInfo(tenantName?: string) {
  // inject the router manualy to read the current route and make decisions
  this.router = this.injector.get(Router);
  console.log(this.router);
  let themingConfig = localStorage.getItem('theming');
  if (this.router.isActive('/') && (themingConfig == undefined || themingConfig == null)) {
        alert('no theming config detected, making fresh request');
        const option = {
          url : 'https://api.myjson.com/bins/knpo0',
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
      else if (this.router.isActive('/') && (themingConfig !== undefined && themingConfig !== null)) {
        alert('we detected the configuration');
        console.log('here is the configuration ',themingConfig);
      }
  }
}