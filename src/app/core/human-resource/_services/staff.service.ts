import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StaffModel } from '../_models/staff.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Staff to the server
  createStaff(staff: StaffModel): Observable<StaffModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StaffModel>(Constants.URL.HOST_URL+Constants.Human_Resource.Staff, staff, {headers: httpHeaders});
  }

  // READ
  getAllStaffs(): Observable<StaffModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StaffModel[]>(Constants.URL.HOST_URL+Constants.Human_Resource.Staff, {headers: httpHeaders});
  }

  getStaffById(staffId: number): Observable<StaffModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StaffModel>(Constants.URL.HOST_URL+Constants.Human_Resource.Staff+ `/${staffId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findStaffs(queryParams: QueryParamsModel,roleId): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const httpParams =new HttpParams()
    .set('roleId', roleId.toString())
    .set('pageNo', queryParams.pageNumber.toString())
    .set('pageSize', queryParams.pageSize.toString())
    .set('searchTerm', '')
    .set('sortBy', 'id');

    const url =Constants.URL.HOST_URL+Constants.Human_Resource.Staff ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  findStaffsuser(queryParams: QueryParamsModel,role): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const httpParams =new HttpParams()
    .set('role-name', role.toString())
    .set('pageNo', queryParams.pageNumber.toString())
    .set('pageSize', queryParams.pageSize.toString())
    .set('sortBy', 'id');

    const url =Constants.URL.HOST_URL+Constants.Human_Resource.User ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  findParentsuser(queryParams: QueryParamsModel,role): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const httpParams =new HttpParams()
    .set('role-name', role.toString())
    .set('pageNo', queryParams.pageNumber.toString())
    .set('pageSize', queryParams.pageSize.toString())
    .set('sortBy', 'id');

    const url =Constants.URL.HOST_URL+Constants.Human_Resource.User ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the Staff on the server
  updateStaff(staff: StaffModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Human_Resource.Staff+'/'+staff.id, staff, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForStaff(staffs: StaffModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      staffsForUpdate: staffs,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Human_Resource.Staff+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Staff from the server
  deleteStaff(staffId: number): Observable<StaffModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Human_Resource.Staff}/${staffId}`;
    return this.http.delete<StaffModel>(url,{headers: httpHeaders});
  }

  deleteStaffs(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Human_Resource.Staff + '/deleteStaffs';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {staffIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


