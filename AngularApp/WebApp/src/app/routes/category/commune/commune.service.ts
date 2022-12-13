import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class CommuneService {

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}Commune/GetAll`, data);
  }

  
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}Commune/GetByPage`, data);
  }
  getAllProvince(data: any) {
    return this.http.post(`${this.apiUrl}Province/GetAll`, data);
  }

  
  getDistrictByProvince(data: any) {
    return this.http.post(`${this.apiUrl}Commune/getDistrictByProvince`, data);
  }


  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}Commune/getbyid`, data);
  }
  deleteCommune(data: any) {
    return this.http.post(`${this.apiUrl}Commune/DeleteCommune`, data);
  }

  savecommune(data: any) {
    return this.http.post(`${this.apiUrl}Commune/SaveCommune`, data);
  }

}
