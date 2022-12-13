import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '@core/bootstrap/config.service';
@Injectable({
    providedIn: 'root',
})
export class RenewalprofileService {
    private apiUrl: string;

    constructor(private config: ConfigService, private http: HttpClient) {
        var conf = this.config.getConfig();
        this.apiUrl = conf.apiBaseUrl;
    }
    getall(data: any) {
        return this.http.post(`${this.apiUrl}renewalprofile/Getall`, data);
    }
    getByPage(data: any) {
        return this.http.post(`${this.apiUrl}renewalprofile/GetByPage`, data);
    }

    getbyid(data: any) {
        return this.http.post(`${this.apiUrl}renewalprofile/GetByID`, data);
    }
    // getbyidList(data: any) {
    //   return this.http.post(`${this.apiUrl}registrasionlist/GetByIDList`, data);
    // }
    getbyidListPayRecord(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/GetByIDListPayRecord`, data);
    }
    deleteRenewalprofile(data: any) {
        return this.http.post(`${this.apiUrl}renewalprofile/delete`, data);
    }

    saverenewalprofile(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/SaveRenewwalProfile`, data);
    }
    savepayrecord(data: any) {
        return this.http.post(`${this.apiUrl}payrecord/SavePayRecord`, data);
    }
    savereturnrecord(data: any) {
        return this.http.post(`${this.apiUrl}returnrecord/SaveReturnrecord`, data);
    }
    saverequest(data: any) {
        return this.http.post(`${this.apiUrl}returnrecord/SaveRequest`, data);
    }
    saveCancelContent(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/saveCancelContent`, data);
    }
    GetAllStaff(data: any) {
        return this.http.post(`${this.apiUrl}user/GetAllstaffRenewalprofile`, data);
    }

    getrecordbyunit(data: any) {
        return this.http.post(`${this.apiUrl}registrasionlist/GetRecordByUnitRenewalprofile`, data);
    }

    getallcondition(data: any) {
        debugger;
        return this.http.post(`${this.apiUrl}condition/GetAll`, data);
    }
    getAllCondition(data: any) {
        return this.http.post(`${this.apiUrl}condition/GetAll`, data);
    }
}
