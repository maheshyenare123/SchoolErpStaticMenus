import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StudentClassModel } from '../_models/student-class.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentClassService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new StudentClass to the server
  createStudentClass(studentClass: StudentClassModel): Observable<StudentClassModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StudentClassModel>(Constants.URL.HOST_URL+Constants.Academics.Class, studentClass, {headers: httpHeaders});
  }

  // READ
  getAllStudentClasss(): Observable<StudentClassModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentClassModel[]>(Constants.URL.HOST_URL+Constants.Academics.Class, {headers: httpHeaders});
  }
  getAllSectionByClasssId(id): Observable<StudentClassModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentClassModel[]>(Constants.URL.HOST_URL+Constants.Academics.Class+"/"+id+"/sections", {headers: httpHeaders});
  }
  getStudentClassById(studentClassId: number): Observable<StudentClassModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentClassModel>(Constants.URL.HOST_URL+Constants.Academics.Class+ `/${studentClassId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findStudentClasss(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Academics.Class ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the StudentClass on the server
  updateStudentClass(studentClass: StudentClassModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Academics.Class+'/'+studentClass.id, studentClass, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForStudentClass(studentClasss: StudentClassModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      studentClasssForUpdate: studentClasss,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Academics.Class+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the StudentClass from the server
  deleteStudentClass(studentClassId: number): Observable<StudentClassModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Academics.Class}/${studentClassId}`;
    return this.http.delete<StudentClassModel>(url, {headers: httpHeaders});
  }

  deleteStudentClasss(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Academics.Class + '/deleteStudentClasss';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {studentClassIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


