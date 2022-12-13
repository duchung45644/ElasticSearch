import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, mapTo } from 'rxjs/operators';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  redirectUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }

  signup(data: any) {
    return this.http.post(`${this.apiUrl}/user/signup`, data, this.httpOptions);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}user/login`, data, this.httpOptions);
  }
}
