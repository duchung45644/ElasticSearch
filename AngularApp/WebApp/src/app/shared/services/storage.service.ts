import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private cookieService: CookieService) {
  }
  getCookie(key: string) {
    const cookieExists: boolean = this.cookieService.check(key);
    if (!cookieExists) return {}
    return JSON.parse(this.cookieService.get(key));
  }

  setCookie(key: string, value: any): boolean {
    console.log(key);
    console.log(JSON.stringify(value));
    this.cookieService.set(key, JSON.stringify(value),1);
    return true;
  }

  removeCookie(key: string) {
    this.cookieService.delete(key);
  }

  clearCookie() {
    this.cookieService.deleteAll();
  }

  get(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}') || {};
  }

  set(key: string, value: any): boolean {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
