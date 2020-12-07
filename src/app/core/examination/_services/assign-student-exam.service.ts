import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { Observable } from 'rxjs';
import { AssignExamStudentRequestDtoModel } from '../_models/assign-exam-student-request-dto.model'


@Injectable({
  providedIn: 'root'
})
export class AssignStudentExamService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new AssignStudentExam to the server
  createAssignStudentExam(assignStudentExam: AssignExamStudentRequestDtoModel): Observable<AssignExamStudentRequestDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<AssignExamStudentRequestDtoModel>(Constants.URL.HOST_URL+Constants.Exams.AssignStudentExam, assignStudentExam, {headers: httpHeaders});
  }

  // READ
  getAllAssignStudentExams(): Observable<AssignExamStudentRequestDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<AssignExamStudentRequestDtoModel[]>(Constants.URL.HOST_URL+Constants.Exams.AssignStudentExam, {headers: httpHeaders});
  }

  getAssignStudentExamById(assignStudentExamId: number): Observable<AssignExamStudentRequestDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<AssignExamStudentRequestDtoModel>(Constants.URL.HOST_URL+Constants.Exams.AssignStudentExam+ `/${assignStudentExamId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result

  findAssignStudentExams(queryParams,classId:number,sectionId:number,examId:number): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
   // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
//
debugger
      const httpParams =new HttpParams()
      .set('classesId', classId.toString())
      .set('exam-id', examId.toString())
      .set('pageNo', queryParams.pageNo.toString())
      .set('pageSize', queryParams.itemsPerPage.toString())
      .set('sectionId', sectionId.toString())
      .set('sortBy', 'id');

      const url =Constants.URL.HOST_URL+Constants.Exams.AssignStudentExam;
      return this.http.get<QueryResultsModel>(url, {
        headers: httpHeaders,
        params: httpParams
      });
   
  
  }

  // UPDATE => PUT: update the AssignStudentExam on the server
  updateAssignStudentExam(assignStudentExam: AssignExamStudentRequestDtoModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Exams.AssignStudentExam+'/'+assignStudentExam.examId, assignStudentExam, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForAssignStudentExam(assignStudentExams: AssignExamStudentRequestDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      assignStudentExamsForUpdate: assignStudentExams,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Exams.AssignStudentExam+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the AssignStudentExam from the server
  deleteAssignStudentExam(assignStudentExamId: number): Observable<AssignExamStudentRequestDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Exams.AssignStudentExam}/${assignStudentExamId}`;
    return this.http.delete<AssignExamStudentRequestDtoModel>(url, {headers: httpHeaders});
  }

  deleteAssignStudentExams(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Exams.AssignStudentExam + '/deleteAssignStudentExams';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {assignStudentExamIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


