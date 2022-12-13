import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class HouseService {

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}House/GetAll`, data);
  }

  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}House/GetByPage`, data);
  }

  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}House/getbyid`, data);
  }
  deleteHouse(data: any) {
    return this.http.post(`${this.apiUrl}House/DeleteHouse`, data);
  }

  savehouse(data: any) {
    return this.http.post(`${this.apiUrl}House/SaveHouse`, data);
  }

}
