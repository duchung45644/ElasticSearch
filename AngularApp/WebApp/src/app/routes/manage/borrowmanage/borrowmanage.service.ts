import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '@core/bootstrap/config.service';
@Injectable({
    providedIn: 'root',
})
export class BorrowmanageService {
    private apiUrl: string;

    constructor(private config: ConfigService, private http: HttpClient) {
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
    getByPageAll(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/GetByPageAll`, data);
    }
    DeleteAll(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/RowSelectionChangeLog`, data);
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
    rowSelectionChangeLog(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/RowSelectionChangeLog`, data);
    }
    GetAllDepartment(data: any) {
        return this.http.post(`${this.apiUrl}Department/GetAll`, data);
    }
    getfond(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/Getfondbydepartment`, data);
    }
    GetAllStaff(data: any) {
        return this.http.post(`${this.apiUrl}user/GetAllStaff`, data);
    }

    ChangeRegistrasionlist(data: any) {
        return this.http.post(`${this.apiUrl}Registrasionlist/ChangeRegistrasionlist`, data);
    }
    getbyid_List(data: any) {
        return this.http.post(`${this.apiUrl}list/GetByID_List`, data);
    }
    getallcondition(data: any) {
        return this.http.post(`${this.apiUrl}condition/GetAll`, data);
    }
    saveAddinformation(data: any) {
        return this.http.post(`${this.apiUrl}list/saveAddinformation`, data);
    }
    getbyidDocView(data: any) {
        return this.http.post(`${this.apiUrl}list/GetByIDDocView`, data);
    }
    getallcatalog(data: any) {
        return this.http.post(`${this.apiUrl}Catalog/GetAll`, data);
    }
    getbyidListPayRecord(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/GetByIDListPayRecord`, data);
    }
    savepayrecord(data: any) {
        return this.http.post(`${this.apiUrl}payrecord/SavePayRecord`, data);
    }
    saverenewalprofile(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/SaveRenewwalProfile`, data);
    }
    saverequest(data: any) {
        return this.http.post(`${this.apiUrl}returnrecord/SaveRequest`, data);
    }
    savereturnrecord(data: any) {
        return this.http.post(`${this.apiUrl}returnrecord/SaveReturnrecord`, data);
    }
    getbyRecord(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/GetByRegistrasionID`, data);
    }
    Browsingsave(data: any) {
        debugger;
        return this.http.post(`${this.apiUrl}registrasionlist/SaveBrowsing`, data);
    }
    listsave(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/SaveList`, data);
    }
    deleteRegis(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/DeleteRegis`, data);
    }
    getbyid_doc(data: any) {
        return this.http.post(`${this.apiUrl}docofrequest/GetByID`, data);
    }
}
