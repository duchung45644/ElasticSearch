import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentArchiveService {

  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
   var conf= this.config.getConfig();
   this.apiUrl = conf.apiBaseUrl;
  }
  
  getByPage(data: any) {
    return this.http.post(`${this.apiUrl}DocumentArchive/GetByPage`, data);
  }
  
  getallcondition(data:any){
    return this.http.post(`${this.apiUrl}Condition/GetAll`, data);    
  }

  getallLanguage(data:any){
    return this.http.post(`${this.apiUrl}Record/GetAllLanguage`, data);
  }

  saveDocumentArchive(data:any){
    return this.http.post(`${this.apiUrl}DocumentArchive/SaveDocumentArchive`, data);
  }

  getallcatalog(data:any){
    return this.http.post(`${this.apiUrl}Catalog/GetAll`, data);    
  }

  getbyid(data:any){
    return this.http.post(`${this.apiUrl}DocumentArchive/GetById`, data);    
  }
}
