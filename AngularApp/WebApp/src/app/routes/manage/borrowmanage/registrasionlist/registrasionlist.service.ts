import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class RegistrasionlistService {


  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
    var conf = this.config.getConfig();
    this.apiUrl = conf.apiBaseUrl;
  }
  getRegistrasionlistList(data: any) {
    return this.http.post(`${this.apiUrl}registrasionlist/GetRegistrasionlistList`, data);
  }
  getall(data: any) {
    return this.http.post(`${this.apiUrl}registrasionlist/Getall`, data);
  }
  getByPage(data: any) {

    return this.http.post(`${this.apiUrl}registrasionlist/GetByPage`, data);
  }
  deleteRegis(data:any){ 
    return this.http.post(`${this.apiUrl}registrasionlist/DeleteRegis`, data);
  }
  getbyid(data: any) {
    return this.http.post(`${this.apiUrl}registrasionlist/GetByRegistrasionID`, data);
  }
  getbyidList_Regis(data: any) {

    return this.http.post(`${this.apiUrl}registrasionlist/GetByIDList_Regis`, data);
  }
  deleteRegistrasionlist(data: any) {
    return this.http.post(`${this.apiUrl}registrasionlist/Delete`, data);
  }
  saveregistrasionlist(data: any) {
    return this.http.post(`${this.apiUrl}registrasionlist/Save`, data);
  }
  GetAllFileCode(data: any) {
    return this.http.post(`${this.apiUrl}registrasionlist/GetAllFileCode`, data);
  }
  GetAllFondName(data: any) {
    return this.http.post(`${this.apiUrl}registrasionlist/GetAllFondName`, data);
  }
  getbyBorrowRequestId(data: any) {
    return this.http.post(`${this.apiUrl}registrasionlist/GetByRegistrasionlistId`, data);
  }
  getrecordbyunit(data: any) {
    return this.http.post(`${this.apiUrl}registrasionlist/GetRecordByUnit`, data);
  }
  rowSelectionChangeLog(data: any){
    return this.http.post(`${this.apiUrl}registrasionlist/RowSelectionChangeLog`, data)
  }
  GetAllDepartment(data: any){
    return this.http.post(`${this.apiUrl}Department/GetAll`, data)
  }
  getfond(data: any){
    return this.http.post(`${this.apiUrl}registrasionlist/Getfondbydepartment`, data)
  }
  GetAllStaff(data: any){
    return this.http.post(`${this.apiUrl}user/GetAllStaff`, data)
  }
  
  ChangeRegistrasionlist(data:any){
    return this.http.post(`${this.apiUrl}Registrasionlist/ChangeRegistrasionlist`, data)
  }
  getbyid_List(data: any) {
    return this.http.post(`${this.apiUrl}list/GetByID_List`, data);
  }
  GetAllAttachmentOfDocument(data: any){
    return this.http.post(`${this.apiUrl}registrasionlist/GetAllAttachmentOfDocument`, data)
  }
  GetAllDocofrequest(data:any){
    return this.http.post(`${this.apiUrl}Docofrequest/GetAll`, data)
  }
  GetByRecordId(data:any){
    return this.http.post(`${this.apiUrl}DocumentArchive/GetByRecordId`, data)
  }
  DeleteAll(data:any){ 
    return this.http.post(`${this.apiUrl}registrasionlist/RowSelectionChangeLog`, data);
  }
}