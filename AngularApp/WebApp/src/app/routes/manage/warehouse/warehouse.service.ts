import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}warehouse/GetAll`, data);
  }
  getTreeUnit(data: any) {
    return this.http.post(`${this.apiUrl}warehouse/GetTreeUnit`, data);
  }
  deleteshelf(data: any) {
    return this.http.post(`${this.apiUrl}shelf/DeleteShelf`, data);
  }
  WarehouseTree(data: any) {
    return this.http.post(`${this.apiUrl}warehouse/WarehouseTree`, data);
  }
  getWarehouseTree(data: any) {
    return this.http.post(`${this.apiUrl}warehouse/GetWarehouseTree`, data);
  }
  saveshelf(data: any) {
    return this.http.post(`${this.apiUrl}shelf/SaveShelf`, data);
  }
  getbyid(data: any) {
   
    return this.http.post(`${this.apiUrl}warehouse/getbyid`, data);
  }
  deleteWarehouse(data: any) {
    return this.http.post(`${this.apiUrl}warehouse/DeleteWarehouse`, data);
  }

  savewarehouse(data: any) {
    return this.http.post(`${this.apiUrl}warehouse/SaveWarehouse`, data);
  }
  GetAllCategory(data: any) {
    return this.http.post(`${this.apiUrl}Warehouse/GetAllCategory`, data);
  }
  getAllCategoryShelf(data: any) {
    return this.http.post(`${this.apiUrl}shelf/GetAllCategory`, data);
  }
  getshelfbyid(data: any) {
    return this.http.post(`${this.apiUrl}shelf/GetById`, data);
  }
  // GetAllWarehouse(data: any) {
  //   return this.http.post(`${this.apiUrl}warehouse/GetAllWarehouse`, data);
  // }
}
