import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
    var conf = this.config.getConfig();
    this.apiUrl = conf.apiBaseUrl;
  }
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}Category/GetByPage`, data);
  }
  
  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}Category/GetById`, data);
  }
  delete(data: any) {
    return this.http.post(`${this.apiUrl}Category/Delete`, data);
  }

  save(data: any) {
    return this.http.post(`${this.apiUrl}Category/Save`, data);
  }
  
  GetFormJsonByCode(data: any) {
    return this.http.post(`${this.apiUrl}DynamicForm/getbycode`, data);
  } 
  getall(data: any) {
    return this.http.post(`${this.apiUrl}Category/GetAll`, data);
  }
}
