import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthLoginService {
  
//  url=`http://yamistha.cloudjiffy.net/auth/login/`;

 url=`http://3.140.52.88:8080/auth/login/`;

 

  constructor(private  http:HttpClient) { }
  isLogin(loginRequest): any {
    return this.http.post(this.url, loginRequest);
  }
  
 
}
