import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class RecordtypeService {
  

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}recordtype/GetAll`, data);
  }
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}recordtype/GetByPage`, data);
  }

  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}recordtype/GetById`, data);
  }
  delete(data: any) {
    return this.http.post(`${this.apiUrl}recordtype/Delete`, data);
  }

  save(data: any) {
    return this.http.post(`${this.apiUrl}recordtype/Save`, data);
  }

}
