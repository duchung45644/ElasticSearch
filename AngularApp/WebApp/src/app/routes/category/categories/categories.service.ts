import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

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
  getAllDVT(data: any) {
    return this.http.post(`${this.apiUrl}unitassets/Getall`, data);
  }
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}Categories/GetByPage`, data);
  }

  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}Categories/GetById`, data);
  }
  getbyHouseid(data: any) {
    return this.http.post(`${this.apiUrl}Categories/GetByHouseId`, data);
  }


  savecategories(data: any) {
    return this.http.post(`${this.apiUrl}Categories/SaveCategories`, data);
  }

  deleteCategories(data: any) {
    return this.http.post(`${this.apiUrl}Categories/DeleteCategories`, data);
  }

  
  getAllHouse(data: any) {
    return this.http.post(`${this.apiUrl}House/GetAllForDropdown`, data);
  }
 

  getAllCate(data: any) {
    return this.http.post(`${this.apiUrl}FamCate/GetAllCate`, data);
  }



}
