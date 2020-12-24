import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { HomeworkDtoModel } from '../_models/homeworkDto.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HomeworkService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Homework to the server
  createHomework(homework: HomeworkDtoModel): Observable<HomeworkDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<HomeworkDtoModel>(Constants.URL.HOST_URL + Constants.Homework.Homework_Add, homework, { headers: httpHeaders });
  }

  // READ
  getAllHomeworks(): Observable<HomeworkDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<HomeworkDtoModel[]>(Constants.URL.HOST_URL + Constants.Homework.Homework_Add, { headers: httpHeaders });
  }

  getHomeworkById(homeworkId: number): Observable<HomeworkDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<HomeworkDtoModel>(Constants.URL.HOST_URL + Constants.Homework.Homework_Add + `/${homeworkId}`, { headers: httpHeaders });
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findHomeworks(queryParams: QueryParamsModel, classId, sectionId, subjectGroupSubjectId, subjectId): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const httpParams = new HttpParams()
      .set('sortBy', queryParams.sortField)
      .set('pageNo', queryParams.pageNumber.toString())
      .set('pageSize', queryParams.pageSize.toString())
      .set('classID', classId.toString())
      .set('sectionID', sectionId.toString())
      .set('subjectGroupID', subjectGroupSubjectId.toString())
      .set('subjectID', subjectId.toString());

    const url = Constants.URL.HOST_URL + Constants.Homework.Homework_Add;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the Homework on the server
  updateHomework(homework: HomeworkDtoModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL + Constants.Homework.Homework_Add + '/' + homework.id, homework, { headers: httpHeader });
  }

  // UPDATE Status
  updateStatusForHomework(homeworks: HomeworkDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      homeworksForUpdate: homeworks,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL + Constants.Homework.Homework_Add + '/updateStatus';
    return this.http.put(url, body, { headers: httpHeaders });
  }

  // DELETE => delete the Homework from the server
  deleteHomework(homeworkId: number): Observable<HomeworkDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL + Constants.Homework.Homework_Add}/${homeworkId}`;
    return this.http.delete<HomeworkDtoModel>(url, { headers: httpHeaders });
  }

  deleteHomeworks(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL + Constants.Homework.Homework_Add + '/deleteHomeworks';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = { homeworkIdsForDelete: ids };
    return this.http.put<QueryResultsModel>(url, body, { headers: httpHeaders });
  }


}


