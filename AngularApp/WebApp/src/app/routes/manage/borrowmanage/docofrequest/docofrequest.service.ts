import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class DocofrequestService {


  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
    var conf = this.config.getConfig();
    this.apiUrl = conf.apiBaseUrl;
  }

  getByPage(data: any) {
   
    return this.http.post(`${this.apiUrl}docofrequest/GetByPage`, data);
  }

  getall(data: any) {
    
    return this.http.post(`${this.apiUrl}docofrequest/Getall`, data);
  }

  getbyid_doc(data: any) {

    return this.http.post(`${this.apiUrl}docofrequest/GetByID`, data);
  }

  deleteDocofrequest(data: any) {
    return this.http.post(`${this.apiUrl}docofrequest/Delete`, data);
  }

  docofrequestDelete(data: any) {
    return this.http.post(`${this.apiUrl}docofrequest/DocofrequestDelete`, data);
  }
  getbyBorrowRequestId(data: any) {

    return this.http.post(`${this.apiUrl}registrasionlist/GetByRegistrasionlistId`, data);
  }
  GetAllStaff(data: any){
    return this.http.post(`${this.apiUrl}user/GetAllstaff`, data)
  }
  GetAllFondName(data: any) {
    return this.http.post(`${this.apiUrl}registrasionlist/GetAllFondName`, data);
  }
  getallcondition(data:any){
    return this.http.post(`${this.apiUrl}condition/GetAll`, data);    
  }
  getrecordbyunit(data: any) {

    return this.http.post(`${this.apiUrl}registrasionlist/GetRecordByUnit`, data);
  }
  GetAllDepartment(data: any){
    return this.http.post(`${this.apiUrl}Department/GetAll`, data)
  }
  getfond(data: any){
    return this.http.post(`${this.apiUrl}registrasionlist/Getfondbydepartment`, data)
  }

}