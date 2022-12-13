// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AppConfigService {

//   private config: any;
//   public configSubject$: Subject<any> = new Subject<any>();

//   constructor(private _http: HttpClient) { }

//   public loadConfig() {

//     return this._http.get('./assets/config.json')
//       .toPromise()
//       .then((config: any) => {
//         this.config = config;
//         console.log(this.config);
//         this.configSubject$.next(this.config);
//       })
//       .catch((err: any) => {
//         console.error(err);
//       })
//   }

//   getConfig() {
//     return this.config;
//   }
//   get apiBaseUrl() {
//     if (!this.config) {
//       throw Error('Config file not loaded!');
//     }

//     return this.config.apiBaseUrl;
//   }

//   get baseUrl() {
//     if (!this.config) {
//       throw Error('Config file not loaded!');
//     }

//     return this.config.baseUrl;
//   }
// }

 
