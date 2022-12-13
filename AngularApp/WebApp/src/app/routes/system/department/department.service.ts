import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}department/GetByPage`, data);
  }

  Init(data: any) {
    return this.http.post(`${this.apiUrl}department/Init`, data);
  }
  getAllDepartment(data: any) {
    return this.http.post(`${this.apiUrl}department/GetAllDepartment`, data);
  }

  getTreeUnit(data: any) {
    return this.http.post(`${this.apiUrl}department/GetTreeUnit`, data);
  }

  
  getDepartmentById(data: any) {
    return this.http.post(`${this.apiUrl}department/getbyid`, data);
  }
  loadActionOfUnit(data: any) {
    return this.http.post(`${this.apiUrl}department/LoadActionOfUnit`, data);
  }
  saveActionOfUnit(data: any) {
    return this.http.post(`${this.apiUrl}department/saveActionOfUnit`, data);
  }
  getStaffById(data: any) {
    return this.http.post(`${this.apiUrl}department/GetStaffById`, data);
  }
  deleteDepartment(data: any) {
    return this.http.post(`${this.apiUrl}department/DeleteDepartment`, data);
  }

  saveDepartment(data: any) {
    return this.http.post(`${this.apiUrl}department/SaveDepartment`, data);
  }


  
  saveStaff(data: any) {
    return this.http.post(`${this.apiUrl}department/saveStaff`, data);
  }

  deleteStaff(data: any) {
    return this.http.post(`${this.apiUrl}department/DeleteStaff`, data);
  }
  resetPasswordStaff(data: any) {
    return this.http.post(`${this.apiUrl}department/ResetPasswordStaff`, data);
  }


  saveRoleOfStaff(data: any ) {
    return this.http.post(`${this.apiUrl}department/SaveRoleOfStaff`, data);
  }


}
