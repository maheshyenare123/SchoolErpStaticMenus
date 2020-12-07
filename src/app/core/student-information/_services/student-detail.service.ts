import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StudentDtoModel } from '../_models/studentDto.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentDetailService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new StudentDetail to the server
  createStudentDetail(studentDetail: StudentDtoModel): Observable<StudentDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StudentDtoModel>(Constants.URL.HOST_URL+Constants.Student_Information.Student, studentDetail, {headers: httpHeaders});
  }

  // READ
  getAllStudentDetails(): Observable<StudentDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentDtoModel[]>(Constants.URL.HOST_URL+Constants.Student_Information.Student, {headers: httpHeaders});
  }

  getStudentDetailById(studentDetailId: number): Observable<StudentDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentDtoModel>(Constants.URL.HOST_URL+Constants.Student_Information.Student+ `/${studentDetailId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findStudentDetails(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Student_Information.Student ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the studentDetail on the server
  updateStudentDetail(studentDetail: StudentDtoModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Student_Information.Student+'/'+studentDetail.id, studentDetail, {headers: httpHeaders});
  }

  // UPDATE Status
  updateStatusForStudentDetail(studentDetails: StudentDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      studentDetailsForUpdate: studentDetails,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Student+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the studentDetail from the server
  deleteStudentDetail(studentDetailId: number): Observable<StudentDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Student_Information.Student}/${studentDetailId}`;
    return this.http.delete<StudentDtoModel>(url,{headers: httpHeaders});
  }

  deleteStudentDetails(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Student + '/deleteStudentDetails';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {studentDetailIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


