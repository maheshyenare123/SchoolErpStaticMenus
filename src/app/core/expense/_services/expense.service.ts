import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ExpenseModel } from '../_models/expense.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Expense to the server
  createExpense(expense: ExpenseModel): Observable<ExpenseModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ExpenseModel>(Constants.URL.HOST_URL+Constants.Expenses.Expense, expense, {headers: httpHeaders});
  }

  // READ
  getAllExpenses(): Observable<ExpenseModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ExpenseModel[]>(Constants.URL.HOST_URL+Constants.Expenses.Expense, {headers: httpHeaders});
  }

  getExpenseById(expenseId: number): Observable<ExpenseModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ExpenseModel>(Constants.URL.HOST_URL+Constants.Expenses.Expense+ `/${expenseId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findExpenses(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Expenses.Expense ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the Expense on the server
  updateExpense(expense: ExpenseModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Expenses.Expense+'/'+expense.id, expense, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForExpense(expenses: ExpenseModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      expensesForUpdate: expenses,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Expenses.Expense+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Expense from the server
  deleteExpense(expenseId: number): Observable<ExpenseModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Expenses.Expense}/${expenseId}`;
    return this.http.delete<ExpenseModel>(url, {headers: httpHeaders});
  }

  deleteExpenses(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Expenses.Expense + '/deleteExpenses';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {expenseIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


