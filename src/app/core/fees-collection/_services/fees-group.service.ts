import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { FeesGroupModel } from '../_models/fees-group.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FeesGroupService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new FeesGroup to the server
  createFeesGroup(feesGroup: FeesGroupModel): Observable<FeesGroupModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<FeesGroupModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Group, feesGroup, {headers: httpHeaders});
  }

  // READ
  getAllFeesGroups(): Observable<FeesGroupModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<FeesGroupModel[]>(Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Group, {headers: httpHeaders});
  }

  getFeesGroupById(feesGroupId: number): Observable<FeesGroupModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<FeesGroupModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Group+ `/${feesGroupId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findFeesGroups(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Group ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the FeesGroup on the server
  updateFeesGroup(feesGroup: FeesGroupModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Group+'/'+feesGroup.id, feesGroup, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForFeesGroup(feesGroups: FeesGroupModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      feesGroupsForUpdate: feesGroups,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Group+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the FeesGroup from the server
  deleteFeesGroup(feesGroupId: number): Observable<FeesGroupModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Group}/${feesGroupId}`;
    return this.http.delete<FeesGroupModel>(url, {headers: httpHeaders});
  }

  deleteFeesGroups(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Group + '/deleteFeesGroups';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {feesGroupIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


