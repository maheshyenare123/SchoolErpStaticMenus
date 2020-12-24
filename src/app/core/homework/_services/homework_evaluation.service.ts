import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { HomeworkDtoModel } from '../_models/homeworkDto.model';
import { Observable } from 'rxjs';
import { HomeworkEvaluationDtoModel } from '../_models/homeworkEvaluationDto.model';


@Injectable({
  providedIn: 'root'
})
export class HomeworkEvaluationService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Homework Evaluations to the server
  createHomeworkEvaluation(homeworkEvaluation:  HomeworkEvaluationDtoModel[]){
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(Constants.URL.HOST_URL + Constants.Homework.Homework_Evaluation, homeworkEvaluation, { headers: httpHeaders });
  }

  // get student data for evaluate homework
  findStudentHomeworkEvaluations( homeworkId): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const httpParams = new HttpParams()
      .set('sortBy',"id")
      .set('pageNo',"0")
      .set('pageSize', "10")
      .set('homeWorkId', homeworkId.toString())

    const url = Constants.URL.HOST_URL + Constants.Homework.Homework_Evaluation;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

}