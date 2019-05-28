import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieManagerService {

  constructor() { }

  getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  setCookie(cname, cvalue, exdays = 1) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  getCookieKey(objectname: string, keyname: string) {
    const cookieString = this.getCookie(objectname);
    if (!!cookieString) {
      const cookieJSON = JSON.parse(cookieString) || null;
      if (!!cookieJSON) {
        const cookieKey = !!cookieJSON[keyname] ? cookieJSON[keyname] : null;
        return !!cookieKey ? cookieKey : null;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}