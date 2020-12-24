import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ExamSubjectMarksModel } from '../_models/exam-subject-marks.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExamSubjectMarksService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new ExamSubjectMarks to the server
  createExamSubjectMarks(examSubjectMarks: ExamSubjectMarksModel): Observable<ExamSubjectMarksModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ExamSubjectMarksModel>(Constants.URL.HOST_URL+Constants.Exams.ExamSubjectMarks, examSubjectMarks, {headers: httpHeaders});
  }

  createExamSubjectMarkss(examSubjectMarks: ExamSubjectMarksModel[]): Observable<ExamSubjectMarksModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ExamSubjectMarksModel>(Constants.URL.HOST_URL+Constants.Exams.ExamSubjectMarks, examSubjectMarks, {headers: httpHeaders});
  }

  // READ
  getAllExamSubjectMarkss(): Observable<ExamSubjectMarksModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ExamSubjectMarksModel[]>(Constants.URL.HOST_URL+Constants.Exams.ExamSubjectMarks, {headers: httpHeaders});
  }

  getExamSubjectMarksById(examSubjectMarksId: number): Observable<ExamSubjectMarksModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ExamSubjectMarksModel>(Constants.URL.HOST_URL+Constants.Exams.ExamSubjectMarks+ `/${examSubjectMarksId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findExamSubjectMarkss(queryParams: QueryParamsModel,classId:number,sectionId:number,sessionId:number,examId:number,examSubjectId:number): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    // const url =Constants.URL.HOST_URL+Constants.Exams.ExamSubjectMarks+"students" ;
    // return this.http.get<QueryResultsModel>(url, {
    //   headers: httpHeaders,
    //  params: httpParams
    // });




    const httpParams =new HttpParams()
    .set('classesId', classId.toString())
    .set('examId', examId .toString())
    .set('examSubjectId', examSubjectId .toString()) 
    .set('pageNo', queryParams.pageNumber.toString())
    .set('pageSize', queryParams.pageSize.toString())
    .set('sectionId', sectionId.toString())
    .set('sortBy', 'id');
     const url =Constants.URL.HOST_URL+Constants.Exams.ExamSubjectMarks+"/students" ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });

  }




  // UPDATE => PUT: update the ExamSubjectMarks on the server
  updateExamSubjectMarks(examSubjectMarks: ExamSubjectMarksModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Exams.ExamSubjectMarks+'/'+examSubjectMarks.examResultId, examSubjectMarks, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForExamSubjectMarks(examSubjectMarkss: ExamSubjectMarksModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      examSubjectMarkssForUpdate: examSubjectMarkss,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Exams.ExamSubjectMarks+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the ExamSubjectMarks from the server
  deleteExamSubjectMarks(examSubjectMarksId: number): Observable<ExamSubjectMarksModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Exams.ExamSubjectMarks}/${examSubjectMarksId}`;
    return this.http.delete<ExamSubjectMarksModel>(url, {headers: httpHeaders});
  }

  deleteExamSubjectMarkss(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Exams.ExamSubjectMarks + '/deleteExamSubjectMarkss';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {examSubjectMarksIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


