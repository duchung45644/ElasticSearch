import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from './config.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private settings: SettingsService
  ) {}

  load(): Promise<any> {
         console.log('load config');
    return new Promise((resolve, reject) => {
      this.http
        .get('assets/config.json?_t=' + Date.now())
        .pipe(
          catchError(res => {
            resolve();
            return throwError(res);
          })
        )
        .subscribe(
          (res: any) => {

            this.config.set(res);

            // // Refresh user info
            // // In a real app, user data will be fetched form API
            // this.settings.setUser({
            //   id: 1,
            //   name: 'Zongbin',
            //   email: 'nzb329@163.com',
            //   avatar: '/assets/images/avatar.jpg',
            // });
          },
          () => {
            reject();
          },
          () => {
            resolve();
          }
        );
    });
  }
}
