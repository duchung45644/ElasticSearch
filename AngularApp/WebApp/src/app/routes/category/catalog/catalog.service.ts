import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}catalog/GetAll`, data);
  }
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}catalog/GetByPage`, data);
  }

  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}catalog/GetById`, data);
  }
  deleteCatalog(data: any) {
    return this.http.post(`${this.apiUrl}catalog/DeleteCatalog`, data);
  }

  savecatalog(data: any) {
    return this.http.post(`${this.apiUrl}catalog/SaveCatalog`, data);
  }


  getTree(data: any) {
    return this.http.post(`${this.apiUrl}catalog/GetCatalogTree`, data);
  }
  DeleteAll(data: any) {
    return this.http.post(`${this.apiUrl}catalog/RowSelectionChangeLog`, data);
  }
}
