// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent ,HttpResponse} from "@angular/common/http";

// import { Injectable } from "@angular/core";
// import { Observable, throwError } from "rxjs";
// import { tap, catchError, finalize, map } from "rxjs/operators";
// import { Router } from "@angular/router";
// import { Constants } from "../services/constant";
// import { LoaderService } from '../shared/loader/loader.service';

// @Injectable()

// export class AuthInterceptor implements HttpInterceptor {

//     constructor(private router: Router) {

//     }

//     intercept(request: HttpRequest<any>, next: HttpHandler){
//         console.log('intercept');
//         LoaderService.showLoader();
//         if (localStorage.getItem(Constants.ACCESS_TOKEN) != null) {
//             const clonedReq = request.clone({
//                 headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem(Constants.ACCESS_TOKEN))
//             });
//             return next.handle(clonedReq).pipe(
//                 tap(
//                     req => {
//                         if (req instanceof HttpResponse) {
//                             LoaderService.hideLoader();
//                         }
//                       },
//                     err => {
//                         LoaderService.hideLoader();
//                         if (err.status == 401) {
//                             localStorage.removeItem(Constants.ACCESS_TOKEN);
//                             localStorage.removeItem(Constants.USER);
//                             localStorage.removeItem(Constants.RIGHTS);
//                             localStorage.removeItem(Constants.ACTIONS);
//                             this.router.navigateByUrl('/login');
//                         } else {
//                             return throwError(err);
//                         }
//                     }
//                 )
//             )
//         }
//         else {
//             return next.handle(request).pipe(
//                 tap(
//                     req => {
//                         if (req instanceof HttpResponse) {
//                             LoaderService.hideLoader();
//                         }
//                       },
//                     err => {
//                         LoaderService.hideLoader();
//                         return throwError(err);
//                     }
//                 )
//             );
//         }
//         //   return next.handle(req.clone());
//     }
// }