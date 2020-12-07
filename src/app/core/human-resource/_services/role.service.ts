import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { LeaveTypeModel } from '../_models/leave-type.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


  // READ
  getAllRoles(): Observable<LeaveTypeModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<LeaveTypeModel[]>(Constants.URL.HOST_URL+Constants.Human_Resource.Roles, {headers: httpHeaders});
  }

}