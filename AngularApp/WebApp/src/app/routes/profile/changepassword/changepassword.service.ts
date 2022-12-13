import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
    var conf = this.config.getConfig();
    this.apiUrl = conf.apiBaseUrl;
  }
  
  getStaffById(data: any) {
    return this.http.post(`${this.apiUrl}department/GetStaffById`, data);
  }
  saveChangePassword (data: any) {
    return this.http.post(`${this.apiUrl}department/StaffChangePassword`, data);
  }

}
