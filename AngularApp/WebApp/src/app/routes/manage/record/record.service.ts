import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '@core/bootstrap/config.service';

@Injectable({
    providedIn: 'root',
})
export class RecordService {
    private apiUrl: string;

    constructor(private config: ConfigService, private http: HttpClient) {
        var conf = this.config.getConfig();
        this.apiUrl = conf.apiBaseUrl;
    }

    getall(data: any) {
        return this.http.post(`${this.apiUrl}Record/GetAll`, data);
    }

    getByPage(data: any) {
        return this.http.post(`${this.apiUrl}Record/GetByPage`, data);
    }

    getAllProvince(data: any) {
        return this.http.post(`${this.apiUrl}Province/GetAll`, data);
    }

    getRecordByProvince(data: any) {
        return this.http.post(`${this.apiUrl}Record/getRecordByProvince`, data);
    }

    getbyid(data: any) {
        return this.http.post(`${this.apiUrl}Record/GetById`, data);
    }
    deleteRecord(data: any) {
        return this.http.post(`${this.apiUrl}Record/Delete`, data);
    }

    saveRecord(data: any) {
        return this.http.post(`${this.apiUrl}Record/SaveRecord`, data);
    }

    BarCode(data: any) {
        return this.http.post(`${this.apiUrl}report/BarCodeRecord`, data);
    }

    getallFond(data: any) {
        return this.http.post(`${this.apiUrl}fond/GetAllFond`, data);
    }

    getShelfByWareHouse(data: any) {
        return this.http.post(`${this.apiUrl}shelf/GetAllWarehouse`, data);
    }

    getallWarehouse(data: any) {
        return this.http.post(`${this.apiUrl}warehouse/GetAll`, data);
    }

    getFileCodeByDeparment(data: any) {
        return this.http.post(`${this.apiUrl}Record/GetFileCodeByDeparment`, data);
    }

    getStaffGetByUnit(data: any) {
        return this.http.post(`${this.apiUrl}Record/StaffGetByUnit`, data);
    }

    getBoxbyShelft(data: any) {
        return this.http.post(`${this.apiUrl}Box/GetByShelf`, data);
    }

    getallcondition(data: any) {
        return this.http.post(`${this.apiUrl}Condition/GetAll`, data);
    }

    getAllRights(data: any) {
        return this.http.post(`${this.apiUrl}Record/GetAllRights`, data);
    }

    getAllMaintenance(data: any) {
        return this.http.post(`${this.apiUrl}Record/GetAllMaintenance`, data);
    }

    getallfield(data: any) {
        return this.http.post(`${this.apiUrl}Fields/GetAll`, data);
    }

    waitDestroyRecord(data: any) {
        return this.http.post(`${this.apiUrl}Record/WaitDestroyRecord`, data);
    }

    saveFormativeRecord(data: any) {
        return this.http.post(`${this.apiUrl}Record/SaveFormativeRecord`, data);
    }

    lostRecord(data: any) {
        return this.http.post(`${this.apiUrl}Record/LostRecord`, data);
    }

    getallLanguage(data: any) {
        return this.http.post(`${this.apiUrl}Record/GetAllLanguage`, data);
    }

    getbypageDocumentArchive(data: any) {
        return this.http.post(`${this.apiUrl}DocumentArchive/GetByPage`, data);
    }

    deleteDocumentArchive(data: any) {
        return this.http.post(`${this.apiUrl}DocumentArchive/Delete`, data);
    }
    CancelRecord(data: any) {
        return this.http.post(`${this.apiUrl}Record/CancelRecord`, data);
    }
    DeleteRecordbyId(data: any) {
        return this.http.post(`${this.apiUrl}Record/DeleteRecord`, data);
    }
    UpdateStorageStatus(data: any) {
        return this.http.post(`${this.apiUrl}Record/UpdateStorageStatus`, data);
    }
    GetExtention(data: any) {
        return this.http.post(`${this.apiUrl}Record/GetExtention`, data);
    }
}
