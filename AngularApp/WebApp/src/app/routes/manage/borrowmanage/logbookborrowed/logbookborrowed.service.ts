import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class LogbookborrowedService {


  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
    var conf = this.config.getConfig();
    this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}docofrequest/Getall`, data);
  }
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}Docofrequest/GetByPage`, data);
  }
 getbypageregistrasionlist (data:any){
  return this.http.post(`${this.apiUrl}docofrequest/GetByPageRegitrasionList`, data);
 }
  getbyid(data: any) {

    return this.http.post(`${this.apiUrl}docofrequest/GetByID`, data);
  }

}
