import { Injectable } from '@angular/core';
import * as  dataConfig from './data.config.json';
@Injectable({
  providedIn: 'root'
})
export class ConfigureService {
  dataConfig = (<any>dataConfig);
  constructor() { }

}
