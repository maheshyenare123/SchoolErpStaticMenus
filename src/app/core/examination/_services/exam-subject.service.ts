import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { Observable } from 'rxjs';
import { ExamSubjectDtoModel } from '../_models/exam-subject-dto.model'


@Injectable({
  providedIn: 'root'
})
export class ExamSubjectService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new ExamSubject to the server
  createExamSubject(examSubject: ExamSubjectDtoModel): Observable<ExamSubjectDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ExamSubjectDtoModel>(Constants.URL.HOST_URL+Constants.Exams.ExamSubject, examSubject, {headers: httpHeaders});
  }

  // READ
  getAllExamSubjects(): Observable<ExamSubjectDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ExamSubjectDtoModel[]>(Constants.URL.HOST_URL+Constants.Exams.ExamSubject, {headers: httpHeaders});
  }

  getExamSubjectById(examSubjectId: number): Observable<ExamSubjectDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ExamSubjectDtoModel>(Constants.URL.HOST_URL+Constants.Exams.ExamSubject+ `/${examSubjectId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result

  findExamSubjects(queryParams,examId:number): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
   // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
//
debugger
      const httpParams =new HttpParams()
      .set('exam-id', examId.toString())
      .set('pageNo', queryParams.pageNumber.toString())
      .set('pageSize', queryParams.pageSize.toString())
      .set('sortBy', 'id');
      const url =Constants.URL.HOST_URL+Constants.Exams.ExamSubject;
      return this.http.get<QueryResultsModel>(url, {
        headers: httpHeaders,
        params: httpParams
      });
   
  
  }

  // UPDATE => PUT: update the ExamSubject on the server
  updateExamSubject(examSubject: ExamSubjectDtoModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Exams.ExamSubject, examSubject, {headers: httpHeader});
  }//+'/'+examSubject.examId

  // UPDATE Status
  updateStatusForExamSubject(examSubjects: ExamSubjectDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      examSubjectsForUpdate: examSubjects,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Exams.ExamSubject+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the ExamSubject from the server
  deleteExamSubject(examSubjectId: number): Observable<ExamSubjectDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Exams.ExamSubject}/${examSubjectId}`;
    return this.http.delete<ExamSubjectDtoModel>(url, {headers: httpHeaders});
  }

  deleteExamSubjects(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Exams.ExamSubject + '/deleteExamSubjects';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {examSubjectIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


