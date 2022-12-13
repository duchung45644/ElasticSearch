import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '@core/bootstrap/config.service';
@Injectable({
    providedIn: 'root',
})
export class ShelfService {
    private apiUrl: string;

    constructor(private config: ConfigService, private http: HttpClient) {
        var conf = this.config.getConfig();
        this.apiUrl = conf.apiBaseUrl;
    }
    getall(data: any) {
        return this.http.post(`${this.apiUrl}shelf/Getall`, data);
    }
    getByPage(data: any) {
        return this.http.post(`${this.apiUrl}shelf/GetByPage`, data);
    }
    getByPageWarehouse(data: any) {
        return this.http.post(`${this.apiUrl}warehouse/GetByPage`, data);
    }
    getbytwarehouseid(data: any) {
        return this.http.post(`${this.apiUrl}warehouse/getbyid`, data);
    }
    getshelfbyid(data: any) {
        return this.http.post(`${this.apiUrl}shelf/GetById`, data);
    }
    deleteshelf(data: any) {
        return this.http.post(`${this.apiUrl}shelf/DeleteShelf`, data);
    }
    WarehouseTree(data: any) {
        return this.http.post(`${this.apiUrl}warehouse/WarehouseTree`, data);
    }
    saveshelf(data: any) {
        return this.http.post(`${this.apiUrl}shelf/SaveShelf`, data);
    }

    GetAllCategory(data: any) {
        return this.http.post(`${this.apiUrl}shelf/GetAllCategory`, data);
    }

    GetAllWarehouse(data: any) {
        return this.http.post(`${this.apiUrl}warehouse/GetAll`, data);
    }
    getboxbyid(data: any) {
        return this.http.post(`${this.apiUrl}box/GetById`, data);
    }
    deletebox(data: any) {
        return this.http.post(`${this.apiUrl}box/DeleteBox`, data);
    }
    savebox(data: any) {
        return this.http.post(`${this.apiUrl}box/SaveBox`, data);
    }
    GetAllCategoryBox(data: any) {
        return this.http.post(`${this.apiUrl}Box/GetAllCategory`, data);
    }
    GetByPageRecord(data: any) {
        return this.http.post(`${this.apiUrl}Box/GetByPageRecord`, data);
    }
    Recordgetbyid(data: any) {
        return this.http.post(`${this.apiUrl}Record/GetById`, data);
    }
}
