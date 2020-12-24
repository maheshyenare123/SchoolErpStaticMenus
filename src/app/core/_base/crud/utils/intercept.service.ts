// Angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Logout } from 'src/app/core/auth';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/reducers';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {
  // intercept request and add token
  constructor(private router: Router,private store: Store<AppState>) {}

 
 
 
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
    
  ): Observable<HttpEvent<any>> {
    // tslint:disable-next-line:no-debugger
    // modify request
    // request = request.clone({
    // 	setHeaders: {
    // 		Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    // 	}
    // });
    // console.log('----request----');
    // console.log(request);
    // console.log('--- end of request---');

    return next.handle(request).pipe(
      tap(
        event => {

          if (event instanceof HttpResponse) {
            // console.log('all looks good');
            // http response status code
            // console.log(event.status);



            
          }
        },
        error => {
          // http response status code
          // console.log('----response----');
          // console.error('status code:');
          // tslint:disable-next-line:no-debugger
          
          // console.error(error.message);

          if (error.status === 401) {
                //             // auto logout if 401 response returned from api
                localStorage.removeItem('token');
                localStorage.removeItem(environment.authTokenKey);
                this.store.dispatch(new Logout());
                this.router.navigate(['/auth/login']);
                document.location.reload();
             }



          // console.log('--- end of response---');
        }
      )
    );
  }
}
