import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { SchoolHousModel } from '../_models/schoolHous.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentHouseService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new studentHouse to the server
  createStudentHouse(studentHouse: SchoolHousModel): Observable<SchoolHousModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<SchoolHousModel>(Constants.URL.HOST_URL+Constants.Student_Information.Student_House, studentHouse, {headers: httpHeaders});
  }

  // READ
  getAllStudentHouses(): Observable<SchoolHousModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SchoolHousModel[]>(Constants.URL.HOST_URL+Constants.Student_Information.Student_House, {headers: httpHeaders});
  }

  getStudentHouseById(studentHouseId: number): Observable<SchoolHousModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SchoolHousModel>(Constants.URL.HOST_URL+Constants.Student_Information.Student_House+ `/${studentHouseId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findStudentHouses(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Student_Information.Student_House;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the studentHouse on the server
  updateStudentHouse(studentHouse: SchoolHousModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Student_Information.Student_House+'/'+studentHouse.id, studentHouse, {headers: httpHeaders});
  }

  // UPDATE Status
  updateStatusForStudentHouse(studentHouses: SchoolHousModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      studentHousesForUpdate: studentHouses,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Student_House+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the studentHouse from the server
  deleteStudentHouse(studentHouseId: number): Observable<SchoolHousModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Student_Information.Student_House}/${studentHouseId}`;
    return this.http.delete<SchoolHousModel>(url, {headers: httpHeaders});
  }

  deleteStudentHouses(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Student_House + '/deleteStudentHouses';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {studentHouseIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


