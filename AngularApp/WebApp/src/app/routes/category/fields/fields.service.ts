import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class FieldsService {
  

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}fields/GetAll`, data);
  }
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}fields/GetByPage`, data);
  }

  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}fields/GetById`, data);
  }
  deleteFields(data: any) {
    return this.http.post(`${this.apiUrl}fields/DeleteFields`, data);
  }

  savefields(data: any) {
    return this.http.post(`${this.apiUrl}fields/SaveFields`, data);
  }


  getTree(data: any) {
    return this.http.post(`${this.apiUrl}fields/GetFieldsTree`, data);
  }
  
}
