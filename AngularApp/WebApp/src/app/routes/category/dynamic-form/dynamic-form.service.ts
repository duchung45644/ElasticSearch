import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  GetAll(data: any) {
    return this.http.post(`${this.apiUrl}DynamicForm/GetAll`, data);
  }

  
  SaveDynamicForm(data: any) {
    return this.http.post(`${this.apiUrl}DynamicForm/SaveDynamicForm`, data);
  }

  GetById(data: any) {
    return this.http.post(`${this.apiUrl}DynamicForm/getbyid`, data);
  }
  
  GetByCode(data: any) {
    return this.http.post(`${this.apiUrl}DynamicForm/getbycode`, data);
  } 

  getAllPublicSector(data: any) {

    return this.http.post(`${this.apiUrl}publicsector/GetAll`, data);
  } 
}
