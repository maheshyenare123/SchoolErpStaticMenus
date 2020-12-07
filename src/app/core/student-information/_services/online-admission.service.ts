import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StudentDtoModel } from '../_models/studentDto.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OnlineAdmissionService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new onlineAdmission to the server
  createOnlineAdmission(onlineAdmission: StudentDtoModel): Observable<StudentDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StudentDtoModel>(Constants.URL.HOST_URL+Constants.Student_Information.Online_Addmission, onlineAdmission, {headers: httpHeaders});
  }

  // READ
  getAllOnlineAdmissions(): Observable<StudentDtoModel[]> {
    return this.http.get<StudentDtoModel[]>(Constants.URL.HOST_URL+Constants.Student_Information.Online_Addmission);
  }

  getOnlineAdmissionById(onlineAdmissionId: number): Observable<StudentDtoModel> {
    return this.http.get<StudentDtoModel>(Constants.URL.HOST_URL+Constants.Student_Information.Online_Addmission+ `/${onlineAdmissionId}`);
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findOnlineAdmissions(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Student_Information.Online_Addmission ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the onlineAdmission on the server
  updateOnlineAdmission(onlineAdmission: StudentDtoModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Student_Information.Online_Addmission, onlineAdmission, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForOnlineAdmission(onlineAdmissions: StudentDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      onlineAdmissionsForUpdate: onlineAdmissions,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Online_Addmission+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the onlineAdmission from the server
  deleteOnlineAdmission(onlineAdmissionId: number): Observable<StudentDtoModel> {
    const url = `${Constants.URL.HOST_URL+Constants.Student_Information.Online_Addmission}/${onlineAdmissionId}`;
    return this.http.delete<StudentDtoModel>(url);
  }

  deleteOnlineAdmissions(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Online_Addmission + '/deleteOnlineAdmissions';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {onlineAdmissionIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


