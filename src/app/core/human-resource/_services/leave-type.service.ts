import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { LeaveTypeModel } from '../_models/leave-type.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new LeaveType to the server
  createLeaveType(leaveType: LeaveTypeModel): Observable<LeaveTypeModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<LeaveTypeModel>(Constants.URL.HOST_URL+Constants.Human_Resource.Leave_Type, leaveType, {headers: httpHeaders});
  }

  // READ
  getAllLeaveTypes(): Observable<LeaveTypeModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<LeaveTypeModel[]>(Constants.URL.HOST_URL+Constants.Human_Resource.Leave_Type, {headers: httpHeaders});
  }

  getLeaveTypeById(leaveTypeId: number): Observable<LeaveTypeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<LeaveTypeModel>(Constants.URL.HOST_URL+Constants.Human_Resource.Leave_Type+ `/${leaveTypeId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findLeaveTypes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Human_Resource.Leave_Type ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the LeaveType on the server
  updateLeaveType(leaveType: LeaveTypeModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Human_Resource.Leave_Type+'/'+leaveType.id, leaveType, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForLeaveType(leaveTypes: LeaveTypeModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      leaveTypesForUpdate: leaveTypes,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Human_Resource.Leave_Type+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the LeaveType from the server
  deleteLeaveType(leaveTypeId: number): Observable<LeaveTypeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Human_Resource.Leave_Type}/${leaveTypeId}`;
    return this.http.delete<LeaveTypeModel>(url,{headers: httpHeaders});
  }

  deleteLeaveTypes(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Human_Resource.Leave_Type + '/deleteLeaveTypes';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {leaveTypeIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


