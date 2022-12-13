import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
    var conf = this.config.getConfig();
    this.apiUrl = conf.apiBaseUrl;
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}role/GetAll`, data);
  }


  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}role/getbyid`, data);
  }
  deleteRole(data: any) {
    return this.http.post(`${this.apiUrl}role/DeleteRole`, data);
  }

  saverole(data: any) {
    return this.http.post(`${this.apiUrl}role/SaveRole`, data);
  }
  getActiveRight(data: any) {
    return this.http.post(`${this.apiUrl}role/GetActiveRight`, data);
  }


}
