import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Accessmonitor } from 'app/models/Accsessmonitor';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class AccessmonitorService {
  

  private apiUrl: string;
  accessmonitors:Accessmonitor[];
  accessmonitor:Accessmonitor;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }


  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}accessmonitor/GetByPage`, data);
  }



}
