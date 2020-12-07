import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StaffDesignationModel } from '../_models/staff-designation.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StaffDesignationService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new StaffDesignation to the server
  createStaffDesignation(staffDesignation: StaffDesignationModel): Observable<StaffDesignationModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StaffDesignationModel>(Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Designation, staffDesignation, {headers: httpHeaders});
  }

  // READ
  getAllStaffDesignations(): Observable<StaffDesignationModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StaffDesignationModel[]>(Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Designation, {headers: httpHeaders});
  }

  getStaffDesignationById(staffDesignationId: number): Observable<StaffDesignationModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StaffDesignationModel>(Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Designation+ `/${staffDesignationId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findStaffDesignations(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Designation ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the StaffDesignation on the server
  updateStaffDesignation(staffDesignation: StaffDesignationModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Designation+'/'+staffDesignation.id, staffDesignation, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForStaffDesignation(staffDesignations: StaffDesignationModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      staffDesignationsForUpdate: staffDesignations,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Designation+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the StaffDesignation from the server
  deleteStaffDesignation(staffDesignationId: number): Observable<StaffDesignationModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Designation}/${staffDesignationId}`;
    return this.http.delete<StaffDesignationModel>(url,{headers: httpHeaders});
  }

  deleteStaffDesignations(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Designation + '/deleteStaffDesignations';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {staffDesignationIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


