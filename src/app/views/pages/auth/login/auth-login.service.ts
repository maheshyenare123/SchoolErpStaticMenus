import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthLoginService {
  
 url=`http://yamistha.cloudjiffy.net/auth/login/`;

 

  constructor(private  http:HttpClient) { }
  isLogin(loginRequest): any {
    return this.http.post(this.url, loginRequest);
  }
  
 
}
