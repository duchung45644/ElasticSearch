import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class PositionService {
  

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}position/Getall`, data);
  }
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}Position/GetByPage`, data);
  }

  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}position/getbyid`, data);
  }
  deletePosition(data: any) {
    return this.http.post(`${this.apiUrl}position/DeletePosition`, data);
  }

  saveposition(data: any) {
    return this.http.post(`${this.apiUrl}position/SavePosition`, data);
  }

}
