import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ExamGroupModel } from '../_models/exam-group.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExamGroupService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new ExamGroup to the server
  createExamGroup(examGroup: ExamGroupModel): Observable<ExamGroupModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ExamGroupModel>(Constants.URL.HOST_URL+Constants.Exams.ExamGroup, examGroup, {headers: httpHeaders});
  }

  // READ
  getAllExamGroups(): Observable<ExamGroupModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ExamGroupModel[]>(Constants.URL.HOST_URL+Constants.Exams.ExamGroup, {headers: httpHeaders});
  }

  getExamGroupById(examGroupId: number): Observable<ExamGroupModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ExamGroupModel>(Constants.URL.HOST_URL+Constants.Exams.ExamGroup+ `/${examGroupId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findExamGroups(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Exams.ExamGroup ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the ExamGroup on the server
  updateExamGroup(examGroup: ExamGroupModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Exams.ExamGroup+'/'+examGroup.id, examGroup, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForExamGroup(examGroups: ExamGroupModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      examGroupsForUpdate: examGroups,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Exams.ExamGroup+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the ExamGroup from the server
  deleteExamGroup(examGroupId: number): Observable<ExamGroupModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Exams.ExamGroup}/${examGroupId}`;
    return this.http.delete<ExamGroupModel>(url, {headers: httpHeaders});
  }

  deleteExamGroups(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Exams.ExamGroup + '/deleteExamGroups';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {examGroupIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


