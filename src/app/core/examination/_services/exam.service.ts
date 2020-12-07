import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ExamModel } from '../_models/exam.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Exam to the server
  createExam(exam: ExamModel): Observable<ExamModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ExamModel>(Constants.URL.HOST_URL+Constants.Exams.Exam, exam, {headers: httpHeaders});
  }

  // READ
  getAllExams(): Observable<ExamModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ExamModel[]>(Constants.URL.HOST_URL+Constants.Exams.Exam, {headers: httpHeaders});
  }

  getExamById(examId: number): Observable<ExamModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ExamModel>(Constants.URL.HOST_URL+Constants.Exams.Exam+ `/${examId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findExams(queryParams: QueryParamsModel,examGroupId): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Exams.Exam+`/${examGroupId}` ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }




  // UPDATE => PUT: update the Exam on the server
  updateExam(exam: ExamModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Exams.Exam+'/'+exam.id, exam, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForExam(exams: ExamModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      examsForUpdate: exams,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Exams.Exam+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Exam from the server
  deleteExam(examId: number): Observable<ExamModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Exams.Exam}/${examId}`;
    return this.http.delete<ExamModel>(url, {headers: httpHeaders});
  }

  deleteExams(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Exams.Exam + '/deleteExams';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {examIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


