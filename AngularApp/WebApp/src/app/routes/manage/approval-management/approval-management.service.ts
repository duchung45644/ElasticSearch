import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '@core/bootstrap/config.service';
@Injectable({
    providedIn: 'root',
})
export class ApprovalManagementService {
    private apiUrl: string;

    constructor(private config: ConfigService, private http: HttpClient) {
        var conf = this.config.getConfig();
        this.apiUrl = conf.apiBaseUrl;
    }

    //      ------ Approval management of documents ------
    getPageData(data: any) {
        return this.http.post(`${this.apiUrl}ManagementApproval/GetPageData`, data);
    }

    getInforBorrowSlipById(data: any) {
        return this.http.post(`${this.apiUrl}ManagementApproval/GetInforBorrowSlipById`, data);
    }

    approvalBorrowSlip(data: any) {
        return this.http.post(`${this.apiUrl}ManagementApproval/ApprovalBorrowSlip`, data);
    }

    refuseBorrowSlip(data: any) {
        return this.http.post(`${this.apiUrl}ManagementApproval/RefuseBorrowSlip`, data);
    }

    //      ------ Borrow Return Extend document ------
    getBorrowReturnExtend(data: any) {
        return this.http.post(`${this.apiUrl}BorrowReturnExtend/GetBorrowReturnExtend`, data);
    }

    addBorrowerInfor(data: any) {
        return this.http.post(`${this.apiUrl}BorrowReturnExtend/AddBorrowerInfor`, data);
    }

    extendBorrowSlip(data: any) {
        return this.http.post(`${this.apiUrl}BorrowReturnExtend/ExtendBorrowSlip`, data);
    }

    returnBorrowSlip(data: any) {
        return this.http.post(`${this.apiUrl}BorrowReturnExtend/ReturnBorrowSlip`, data);
    }

    requestReturn(data: any) {
        return this.http.post(`${this.apiUrl}BorrowReturnExtend/RequestReturn`, data);
    }

    refuseRequestReturn(data: any) {
        return this.http.post(`${this.apiUrl}BorrowReturnExtend/RefuseRequestReturn`, data);
    }

    //      ------ Borrow slip list ------
    borrowSlipList(data: any) {
        return this.http.post(`${this.apiUrl}BorrowSlipList/GetBorrowSlipList`, data);
    }

    //      ------ Document return history ------
    getDocumentReturnHistory(data: any) {
        return this.http.post(`${this.apiUrl}DocumentReturnHistory/GetDocumentReturnHistory`, data);
    }

    getHistoryDocumentByRegistrationId(data: any) {
        return this.http.post(`${this.apiUrl}DocumentReturnHistory/GetHistoryDocumentByRegistrationId`, data);
    }

    /////////////////////////////////////////////
    GetAllStaff(data: any) {
        return this.http.post(`${this.apiUrl}user/GetAllstaff`, data);
    }

    getAllCondition(data: any) {
        return this.http.post(`${this.apiUrl}condition/GetAll`, data);
    }
    getbyid(data: any) {
        return this.http.post(`${this.apiUrl}DocumentArchive/GetById`, data);
    }
}
