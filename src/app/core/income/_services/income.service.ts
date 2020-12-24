import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { IncomeModel } from '../_models/income.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Income to the server
  createIncome(income: IncomeModel): Observable<IncomeModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<IncomeModel>(Constants.URL.HOST_URL+Constants.Incomes.Income, income, {headers: httpHeaders});
  }

  // READ
  getAllIncomes(): Observable<IncomeModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<IncomeModel[]>(Constants.URL.HOST_URL+Constants.Incomes.Income, {headers: httpHeaders});
  }

  getIncomeById(incomeId: number): Observable<IncomeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<IncomeModel>(Constants.URL.HOST_URL+Constants.Incomes.Income+ `/${incomeId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findIncomes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Incomes.Income ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the Income on the server
  updateIncome(income: IncomeModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Incomes.Income+'/'+income.id, income, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForIncome(incomes: IncomeModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      incomesForUpdate: incomes,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Incomes.Income+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Income from the server
  deleteIncome(incomeId: number): Observable<IncomeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Incomes.Income}/${incomeId}`;
    return this.http.delete<IncomeModel>(url, {headers: httpHeaders});
  }

  deleteIncomes(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Incomes.Income + '/deleteIncomes';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {incomeIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


