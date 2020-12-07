import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StaffAttendanceModel } from '../_models/staff-attendance.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StaffAttendanceService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new StaffAttendance to the server
  createStaffAttendance(staffAttendance: StaffAttendanceModel): Observable<StaffAttendanceModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StaffAttendanceModel>(Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Attendance, staffAttendance, {headers: httpHeaders});
  }

  // READ
  getAllStaffAttendances(): Observable<StaffAttendanceModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StaffAttendanceModel[]>(Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Attendance, {headers: httpHeaders});
  }

  getStaffAttendanceById(staffAttendanceId: number): Observable<StaffAttendanceModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StaffAttendanceModel>(Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Attendance+ `/${staffAttendanceId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findStaffAttendances(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Attendance ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the StaffAttendance on the server
  updateStaffAttendance(staffAttendance: StaffAttendanceModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Attendance+'/'+staffAttendance.id, staffAttendance, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForStaffAttendance(staffAttendances: StaffAttendanceModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      staffAttendancesForUpdate: staffAttendances,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Attendance+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the StaffAttendance from the server
  deleteStaffAttendance(staffAttendanceId: number): Observable<StaffAttendanceModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Attendance}/${staffAttendanceId}`;
    return this.http.delete<StaffAttendanceModel>(url,{headers: httpHeaders});
  }

  deleteStaffAttendances(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Attendance + '/deleteStaffAttendances';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {staffAttendanceIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


