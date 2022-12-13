import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class RightService {

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}right/GetAll`, data);
  }

  
  
  getRightTree(data: any) {
    return this.http.post(`${this.apiUrl}right/GetRightTree`, data);
  }

  getbyid(data: any) {
   
    return this.http.post(`${this.apiUrl}right/getbyid`, data);
  }
  deleteRight(data: any) {
    return this.http.post(`${this.apiUrl}right/DeleteRight`, data);
  }

  saveright(data: any) {
    return this.http.post(`${this.apiUrl}right/SaveRight`, data);
  }

}
