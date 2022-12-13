import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}Province/GetAll`, data);
  }

  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}Province/GetByPage`, data);
  }

  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}Province/getbyid`, data);
  }
  deleteProvince(data: any) {
    return this.http.post(`${this.apiUrl}Province/DeleteProvince`, data);
  }

  saveprovince(data: any) {
    return this.http.post(`${this.apiUrl}Province/SaveProvince`, data);
  }

}
