import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from "@core/bootstrap/config.service";
@Injectable({
  providedIn: 'root'
})
export class ListService {


  private apiUrl: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
    var conf = this.config.getConfig();
    this.apiUrl = conf.apiBaseUrl;
  }

  getByPage(data: any) {
   
    return this.http.post(`${this.apiUrl}list/GetByPage`, data);
  }

  getbyRecord(data: any) {

    return this.http.post(`${this.apiUrl}registrasionlist/GetByRegistrasionID`, data);
  }
  getbyid_List(data: any) {

    return this.http.post(`${this.apiUrl}list/GetByID_List`, data);
  }
  getRegistrasionlistList(data: any) {
    return this.http.post(`${this.apiUrl}registrasionlist/GetRegistrasionlistList`, data);
  }
  getall(data: any) {
    
    return this.http.post(`${this.apiUrl}registrasionlist/Getall`, data);
  }

  DeleteAll(data:any){
    return this.http.post(`${this.apiUrl}registrasionlist/RowSelectionChangeLog`, data);
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
  GetAllStaff(data: any){
    return this.http.post(`${this.apiUrl}user/GetAllstaff`, data)
  }
  getfond(data: any){
    return this.http.post(`${this.apiUrl}registrasionlist/Getfondbydepartment`, data)
  }
  GetAllDepartment(data: any){
    return this.http.post(`${this.apiUrl}Department/GetAll`, data)
  }
  saveRecord(data: any) {
    return this.http.post(`${this.apiUrl}record/SaveRerecord`, data);
  }
  listsave(data:any){
  return this.http.post(`${this.apiUrl}registrasionlist/SaveList`, data);
  }
  Browsingsave(data:any){debugger
    return this.http.post(`${this.apiUrl}registrasionlist/SaveBrowsing`, data);
    }
  saveAddinformation(data: any) {
    return this.http.post(`${this.apiUrl}list/saveAddinformation`, data);
  }
  getallcatalog(data:any){
    return this.http.post(`${this.apiUrl}Catalog/GetAll`, data);    
  }
  getbyidDocView(data:any){
    return this.http.post(`${this.apiUrl}list/GetByIDDocView`, data);    
  }
  getallcondition(data:any){
    return this.http.post(`${this.apiUrl}condition/GetAll`, data);    
  }
  GetAllAttachmentOfDocument(data: any){
    return this.http.post(`${this.apiUrl}registrasionlist/GetAllAttachmentOfDocument`, data)
  }

}