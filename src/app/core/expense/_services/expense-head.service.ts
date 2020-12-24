import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ExpenseHeadModel } from '../_models/expense-head.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExpenseHeadService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new ExpenseHead to the server
  createExpenseHead(expenseHead: ExpenseHeadModel): Observable<ExpenseHeadModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ExpenseHeadModel>(Constants.URL.HOST_URL+Constants.Expenses.ExpenseHead, expenseHead, {headers: httpHeaders});
  }

  // READ
  getAllExpenseHeads(): Observable<ExpenseHeadModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ExpenseHeadModel[]>(Constants.URL.HOST_URL+Constants.Expenses.ExpenseHead, {headers: httpHeaders});
  }

  getExpenseHeadById(expenseHeadId: number): Observable<ExpenseHeadModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ExpenseHeadModel>(Constants.URL.HOST_URL+Constants.Expenses.ExpenseHead+ `/${expenseHeadId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findExpenseHeads(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Expenses.ExpenseHead ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the ExpenseHead on the server
  updateExpenseHead(expenseHead: ExpenseHeadModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Expenses.ExpenseHead+'/'+expenseHead.id, expenseHead, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForExpenseHead(expenseHeads: ExpenseHeadModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      expenseHeadsForUpdate: expenseHeads,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Expenses.ExpenseHead+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the ExpenseHead from the server
  deleteExpenseHead(expenseHeadId: number): Observable<ExpenseHeadModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Expenses.ExpenseHead}/${expenseHeadId}`;
    return this.http.delete<ExpenseHeadModel>(url, {headers: httpHeaders});
  }

  deleteExpenseHeads(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Expenses.ExpenseHead + '/deleteExpenseHeads';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {expenseHeadIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


