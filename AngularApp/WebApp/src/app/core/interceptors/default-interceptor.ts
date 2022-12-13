import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { environment } from '@env/environment';

import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../authentication/token.service';
import { SettingsService } from '@core/bootstrap/settings.service';


import { ConfigService } from "@core/bootstrap/config.service";

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(
    private config: ConfigService,
    private router: Router,
    private toastr: ToastrService,
    private token: TokenService,
    private settings: SettingsService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
   const url = req.url;

    // Only intercept API url
    if (!url.includes('/api/')) {
      return next.handle(req);
    }
    if (url.includes('/upload/')) {
      return next.handle(req);
    }
    // All APIs need JWT authorization
    const headers = {
    'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token.get().token}`,
    };
    const newReq = req.clone({ url, setHeaders: headers});

    //const newReq = req.clone({ url, setHeaders: headers, withCredentials: true });

    return next.handle(newReq).pipe(
      mergeMap((event: HttpEvent<any>) => this.handleOkReq(event)),
      catchError((error: HttpErrorResponse) => this.handleErrorReq(error))
    );
  }

  private goto(url: string) {
    setTimeout(() => this.router.navigateByUrl(url));
  }

  private handleOkReq(event: HttpEvent<any>): Observable<any> {
    if (event instanceof HttpResponse) {
      const body: any = event.body;
      // failure: { Message: **, Message: 'failure' }
      // success: { Success: 0,  Message: 'success', Data: {} }
      if (body && body.Success == false) {
        if (body.Message && body.Message !== '') {
          this.toastr.error(body.Message);
        }
        return throwError([]);
      } else {
        return of(event);
      }
    }
    // Pass down event if everything is OK
    return of(event);
  }

  private handleErrorReq(error: HttpErrorResponse): Observable<never> {
    switch (error.status) {
      case 401:      
        this.goto(`/login?next=${window.location.pathname}`);
        break;
      case 403:
      case 404:
      case 500:
        this.goto(`/sessions/${error.status}`);
        break;
      default:
        if (error instanceof HttpErrorResponse) {
          console.error('ERROR', error);
          this.toastr.error(error.error.msg || `${error.status} ${error.statusText}`);
        }
        break;
    }
    return throwError(error);
  }
}
