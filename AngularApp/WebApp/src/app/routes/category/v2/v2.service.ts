import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class V2Service {


  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
    var conf = this.config.getConfig();
    this.apiUrl = conf.apiBaseUrl;
  }
  // getByPage(data: any) {
  //   return this.http.post(`${this.apiUrl}Category/GetByPage`, data);
  // }
  
  // getbyid(data: any) {
  //   return this.http.post(`${this.apiUrl}Category/GetById`, data);
  // }
  // delete(data: any) {
  //   return this.http.post(`${this.apiUrl}Category/Delete`, data);
  // }

  // save(data: any) {
  //   return this.http.post(`${this.apiUrl}Category/Save`, data);
  // }
  
  GetFormJsonByCode(data: any) {
    return this.http.post(`${this.apiUrl}DynamicForm/getbycode`, data);
  } 



  publicsector_getall(data: any) {
    return this.http.post(`${this.apiUrl}publicsector/Getall`, data);
  }
  publicsector_getByPage(data: any) {
    return this.http.post(`${this.apiUrl}Publicsector/GetByPage`, data);
  }

  publicsector_getbyid(data: any) {
    return this.http.post(`${this.apiUrl}publicsector/getbyid`, data);
  }
  publicsector_delete(data: any) {
    return this.http.post(`${this.apiUrl}publicsector/DeletePublicsector`, data);
  }

  publicsector_save(data: any) {
    return this.http.post(`${this.apiUrl}publicsector/SavePublicsector`, data);
  }
   

  procedure_getByPage(data: any) {
    return this.http.post(`${this.apiUrl}procedure/GetByPage`, data);
  }
  
  procedure_getByPublicsector(data: any) {
    return this.http.post(`${this.apiUrl}procedure/getProcedureByPublicsector`, data);
  }

  procedure_GetById(data: any) {
    return this.http.post(`${this.apiUrl}procedure/GetById`, data);
  }
  procedure_delete(data: any) {
    return this.http.post(`${this.apiUrl}procedure/DeleteProcedure`, data);
  }

  procedure_save(data: any) {
    return this.http.post(`${this.apiUrl}procedure/SaveProcedure`, data);
  }

}
