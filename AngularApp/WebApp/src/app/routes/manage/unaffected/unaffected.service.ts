import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class UnaffectService {

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  GetAll(data: any) {
    return this.http.post(`${this.apiUrl}unaffected/GetAll`, data);
  }

  
  GetTree(data: any) {
    return this.http.post(`${this.apiUrl}unaffected/GetTree`, data);
  }
  GetByPage(data: any) {
    return this.http.post(`${this.apiUrl}unaffected/GetByPage`, data);
  }

  GetById(data: any) {
   
    return this.http.post(`${this.apiUrl}unaffected/GetById`, data);
  }
  Delete(data: any) {
    return this.http.post(`${this.apiUrl}unaffected/Delete`, data);
  }

  Save(data: any) {
    return this.http.post(`${this.apiUrl}unaffected/Save`, data);
  }
  GetAllUnaffectedChild(data: any) {
   
    return this.http.post(`${this.apiUrl}unaffected/GetAllUnaffectedChild`, data);
  }
  GetUnaffectedChildById(data: any) {
   
    return this.http.post(`${this.apiUrl}unaffected/GetUnaffectedChildById`, data);
  }

}
