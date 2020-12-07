import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { IncomeHeadModel } from '../_models/income-head.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IncomeHeadService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new IncomeHead to the server
  createIncomeHead(incomeHead: IncomeHeadModel): Observable<IncomeHeadModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<IncomeHeadModel>(Constants.URL.HOST_URL+Constants.Incomes.IncomeHead, incomeHead, {headers: httpHeaders});
  }

  // READ
  getAllIncomeHeads(): Observable<IncomeHeadModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<IncomeHeadModel[]>(Constants.URL.HOST_URL+Constants.Incomes.IncomeHead, {headers: httpHeaders});
  }

  getIncomeHeadById(incomeHeadId: number): Observable<IncomeHeadModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<IncomeHeadModel>(Constants.URL.HOST_URL+Constants.Incomes.IncomeHead+ `/${incomeHeadId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findIncomeHeads(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Incomes.IncomeHead ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the IncomeHead on the server
  updateIncomeHead(incomeHead: IncomeHeadModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Incomes.IncomeHead+'/'+incomeHead.id, incomeHead, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForIncomeHead(incomeHeads: IncomeHeadModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      incomeHeadsForUpdate: incomeHeads,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Incomes.IncomeHead+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the IncomeHead from the server
  deleteIncomeHead(incomeHeadId: number): Observable<IncomeHeadModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Incomes.IncomeHead}/${incomeHeadId}`;
    return this.http.delete<IncomeHeadModel>(url, {headers: httpHeaders});
  }

  deleteIncomeHeads(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Incomes.IncomeHead + '/deleteIncomeHeads';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {incomeHeadIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


