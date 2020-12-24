import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { SubjectDtoModel } from '../_models/subjectDto.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Subject to the server
  createSubject(subject: SubjectDtoModel): Observable<SubjectDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<SubjectDtoModel>(Constants.URL.HOST_URL+Constants.Academics.Subject, subject, {headers: httpHeaders});
  }

  // READ
  getAllSubjects(): Observable<SubjectDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SubjectDtoModel[]>(Constants.URL.HOST_URL+Constants.Academics.Subject, {headers: httpHeaders});
  }

  getSubjectById(subjectId: number): Observable<SubjectDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SubjectDtoModel>(Constants.URL.HOST_URL+Constants.Academics.Subject+ `/${subjectId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findSubjects(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Academics.Subject ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the Subject on the server
  updateSubject(subject: SubjectDtoModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Academics.Subject+'/'+subject.id, subject, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForSubject(subjects: SubjectDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      subjectsForUpdate: subjects,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Academics.Subject+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Subject from the server
  deleteSubject(subjectId: number): Observable<SubjectDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Academics.Subject}/${subjectId}`;
    return this.http.delete<SubjectDtoModel>(url, {headers: httpHeaders});
  }

  deleteSubjects(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Academics.Subject + '/deleteSubjects';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {subjectIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


