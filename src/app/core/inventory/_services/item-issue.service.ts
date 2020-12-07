import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ItemIssueModel } from '../_models/item-issue.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemIssueService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new ItemIssue to the server
  createItemIssue(itemIssue: ItemIssueModel): Observable<ItemIssueModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ItemIssueModel>(Constants.URL.HOST_URL+Constants.Inventory.ItemIssue, itemIssue, {headers: httpHeaders});
  }

  // READ
  getAllItemIssues(): Observable<ItemIssueModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ItemIssueModel[]>(Constants.URL.HOST_URL+Constants.Inventory.ItemIssue, {headers: httpHeaders});
  }

  getItemIssueById(itemIssueId: number): Observable<ItemIssueModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ItemIssueModel>(Constants.URL.HOST_URL+Constants.Inventory.ItemIssue+ `/${itemIssueId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findItemIssues(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Inventory.ItemIssue ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the ItemIssue on the server
  updateItemIssue(itemIssue: ItemIssueModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Inventory.ItemIssue+'/'+itemIssue.id, itemIssue, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForItemIssue(itemIssues: ItemIssueModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      itemIssuesForUpdate: itemIssues,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Inventory.ItemIssue+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the ItemIssue from the server
  deleteItemIssue(itemIssueId: number): Observable<ItemIssueModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Inventory.ItemIssue}/${itemIssueId}`;
    return this.http.delete<ItemIssueModel>(url, {headers: httpHeaders});
  }

  deleteItemIssues(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Inventory.ItemIssue + '/deleteItemIssues';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {itemIssueIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


