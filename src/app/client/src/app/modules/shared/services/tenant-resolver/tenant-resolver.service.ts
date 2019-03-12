import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TenantResolverService implements Resolve<any> {

  constructor() { }
  resolve(): Observable<any> {
    return ;
  }
}
