import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '@core/bootstrap/config.service';

@Injectable({
    providedIn: 'root',
})
export class ApproveService {
    private apiUrl: string;

    constructor(private config: ConfigService, private http: HttpClient) {
        var conf = this.config.getConfig();
        this.apiUrl = conf.apiBaseUrl;
    }

    getall(data: any) {
        return this.http.post(`${this.apiUrl}Approve/GetAll`, data);
    }
    GetAllApproveStatus0(data: any) {
        return this.http.post(`${this.apiUrl}Approve/GetAllApproveStatus0`, data);
    }
    GetAllRecord(data: any) {
        return this.http.post(`${this.apiUrl}Approve/GetAllRecord`, data);
    }
    ViewDetailRecordRefuse(data: any) {
        return this.http.post(`${this.apiUrl}Approve/ViewDetailRecordRefuse`, data);
    }
    GetByIdRecord(data: any) {
        return this.http.post(`${this.apiUrl}Approve/GetApproveByIdRecord`, data);
    }
    getallwarehouse(data: any) {
        return this.http.post(`${this.apiUrl}warehouse/GetAll`, data);
    }

    getByPage(data: any) {
        return this.http.post(`${this.apiUrl}Approve/GetByPage`, data);
    }
    GetByPageStatus1(data: any) {
        return this.http.post(`${this.apiUrl}Approve/GetByPageStatus1`, data);
    }
    SaveApprove(data: any) {
        return this.http.post(`${this.apiUrl}Approve/SaveApprove`, data);
    }
    GetById(data: any) {
        return this.http.post(`${this.apiUrl}Approve/GetById`, data);
    }
    DeleteApprove(data: any) {
        return this.http.post(`${this.apiUrl}Approve/DeleteApprove`, data);
    }
    getByPagerecord(data: any) {
        return this.http.post(`${this.apiUrl}Approve/GetByPageRecord`, data);
    }
    GetByIdofDeleteApprove(data: any) {
        return this.http.post(`${this.apiUrl}Approve/GetByIdOfDeleteApprove`, data);
    }
    UpdateDeleteApprove(data: any) {
        return this.http.post(`${this.apiUrl}Approve/UpdateDeleteApprove`, data);
    }
    CancelRecordApprove(data: any) {
        return this.http.post(`${this.apiUrl}Approve/CancelRecordApprove`, data);
    }
    UpdateApprove(data: any) {
        return this.http.post(`${this.apiUrl}Approve/UpdateApprove`, data);
    }

    GetAllRecordStatus(data: any) {
        return this.http.post(`${this.apiUrl}Approve/GetAllRecordStatus`, data);
    }

    DeleteRecordInApprove(data: any) {
        return this.http.post(`${this.apiUrl}Approve/DeleteRecordInApprove`, data);
    }
    getStaffGetByUnit(data: any) {
        return this.http.post(`${this.apiUrl}Approve/GetAllStaff`, data);
    }
}
