import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }

  getall(data: any) {
    return this.http.post(`${this.apiUrl}District/GetAll`, data);
  }

  
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}District/GetByPage`, data);
  }

  getAllProvince(data: any) {
    return this.http.post(`${this.apiUrl}Province/GetAll`, data);
  }

  
  getDistrictByProvince(data: any) {
    return this.http.post(`${this.apiUrl}District/getDistrictByProvince`, data);
  }


  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}District/GetById`, data);
  }
  deleteDistrict(data: any) {
    return this.http.post(`${this.apiUrl}District/DeleteDistrict`, data);
  }

  savedistrict(data: any) {
    return this.http.post(`${this.apiUrl}District/SaveDistrict`, data);
  }

}
