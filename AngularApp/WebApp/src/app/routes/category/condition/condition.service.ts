import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class ConditionService {
  

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}condition/GetAll`, data);
  }
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}condition/GetByPage`, data);
  }

  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}condition/GetById`, data);
  }
  deleteCondition(data: any) {
    return this.http.post(`${this.apiUrl}condition/DeleteCondition`, data);
  }

  savecondition(data: any) {
    return this.http.post(`${this.apiUrl}condition/SaveCondition`, data);
  }

}
