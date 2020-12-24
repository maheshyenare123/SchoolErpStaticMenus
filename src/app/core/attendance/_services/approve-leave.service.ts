import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ApproveLeaveDtoModel } from '../_models/approve-leave.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApproveLeaveService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new ApproveLeave to the server
  createApproveLeave(approveLeave: ApproveLeaveDtoModel): Observable<ApproveLeaveDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ApproveLeaveDtoModel>(Constants.URL.HOST_URL+Constants.Attendance.Approve_Leave, approveLeave, {headers: httpHeaders});
  }

  // READ
  getAllApproveLeaves(): Observable<ApproveLeaveDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ApproveLeaveDtoModel[]>(Constants.URL.HOST_URL+Constants.Attendance.Approve_Leave, {headers: httpHeaders});
  }

  getApproveLeaveById(approveLeaveId: number): Observable<ApproveLeaveDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ApproveLeaveDtoModel>(Constants.URL.HOST_URL+Constants.Attendance.Approve_Leave+ `/${approveLeaveId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findApproveLeaves(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Attendance.Approve_Leave ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the ApproveLeave on the server
  updateApproveLeave(approveLeave: ApproveLeaveDtoModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Attendance.Approve_Leave+'/'+approveLeave.id, approveLeave, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForApproveLeave(approveLeaves: ApproveLeaveDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      approveLeavesForUpdate: approveLeaves,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Attendance.Approve_Leave+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the ApproveLeave from the server
  deleteApproveLeave(approveLeaveId: number): Observable<ApproveLeaveDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Attendance.Approve_Leave}/${approveLeaveId}`;
    return this.http.delete<ApproveLeaveDtoModel>(url, {headers: httpHeaders});
  }

  deleteApproveLeaves(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Attendance.Approve_Leave + '/deleteApproveLeaves';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {approveLeaveIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


