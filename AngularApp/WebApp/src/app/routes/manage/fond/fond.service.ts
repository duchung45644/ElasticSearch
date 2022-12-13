import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class FondService {


  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
    var conf = this.config.getConfig();
    this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}fond/Getall`, data);
  }
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}fond/GetByPage`, data);
  }

  getbyid(data: any) {

    return this.http.post(`${this.apiUrl}fond/GetByID`, data);
  }
  deleteFond(data: any) {
    return this.http.post(`${this.apiUrl}fond/Delete`, data);
  }
  savefond(data: any) {
    return this.http.post(`${this.apiUrl}fond/Save`, data);
  }
  GetAllCategoryNgonNgu(data: any) {
    return this.http.post(`${this.apiUrl}fond/GetAllCategory`, data);
  }
  Init(data: any) {
    return this.http.post(`${this.apiUrl}department/Init`, data);
  }

}
