// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { catchError, tap, mapTo } from 'rxjs/operators';
// import { HttpErrorHandler, HandleError } from '../services/http-error-handler.service'

// import { AppConfigService } from "./AppConfig.service";
// import { Constants } from "../services/constant";

// @Injectable({
//     providedIn: 'root'
// })
// export class RightService {

//     private apiUrl: string;
//     private handleError: HandleError;

//     httpOptions = {
//         headers: new HttpHeaders({
//             'Content-Type': 'application/json'
//         })
//     };

//     redirectUrl: string;

//     constructor(
//         private _appConfig: AppConfigService,
//         private http: HttpClient,
//         private httpErrorHandler: HttpErrorHandler
//     ) {
//         this.apiUrl = this._appConfig.apiBaseUrl;
//         this.handleError = this.httpErrorHandler.createHandleError('RightService')
//     }

//     getall(data: any) {
//         return this.http.post(`${this.apiUrl}right/GetAll`, data, this.httpOptions)
//             .pipe(
//                 catchError(this.handleError('GetAll', null))
//             )
//     }


//     getbyid(data: any) {
//         return this.http.post(`${this.apiUrl}right/getbyid`, data, this.httpOptions)
//             .pipe(
//                 catchError(this.handleError('getbyid', null))
//             );
//     }
//     deleteRight(data: any) {
//         return this.http.post(`${this.apiUrl}right/DeleteRight`, data, this.httpOptions).pipe(
//             catchError(this.handleError('deleteRight', null))
//         );
//     }

//     saveright(data: any) {
//         return this.http.post(`${this.apiUrl}right/SaveRight`, data, this.httpOptions).pipe(
//             catchError(this.handleError('SaveRight', null))
//         );
//     }

// }
