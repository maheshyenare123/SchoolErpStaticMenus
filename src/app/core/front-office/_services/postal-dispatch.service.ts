import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { DispatchReceiveModel } from '../_models/dispose-dispatch-receive.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostalDispatchService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new postalDispatch to the server
  createPostalDispatch(postalDispatch: DispatchReceiveModel): Observable<DispatchReceiveModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<DispatchReceiveModel>(Constants.URL.HOST_URL+Constants.Front_Office.Postal_Dispatch, postalDispatch, {headers: httpHeaders});
  }

  // READ
  getAllPostalDispatchs(): Observable<DispatchReceiveModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<DispatchReceiveModel[]>(Constants.URL.HOST_URL+Constants.Front_Office.Postal_Dispatch, {headers: httpHeaders});
  }

  getPostalDispatchById(postalDispatchId: number): Observable<DispatchReceiveModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<DispatchReceiveModel>(Constants.URL.HOST_URL+Constants.Front_Office.Postal_Dispatch+ `/${postalDispatchId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findPostalDispatchs(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    debugger;
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const httpParams =new HttpParams()
    .set('pageNo', queryParams.pageNumber.toString())
    .set('pageSize', queryParams.pageSize.toString())
    .set('sortBy', 'id')
    .set('type', Constants.DISPATCH);

    const url =Constants.URL.HOST_URL+Constants.Front_Office.Postal_Dispatch ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the postalDispatch on the server
  updatePostalDispatch(postalDispatch: DispatchReceiveModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Front_Office.Postal_Dispatch+'/'+postalDispatch.id, postalDispatch, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForPostalDispatch(postalDispatchs: DispatchReceiveModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      postalDispatchsForUpdate: postalDispatchs,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Postal_Dispatch+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the postalDispatch from the server
  deletePostalDispatch(postalDispatchId: number): Observable<DispatchReceiveModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Front_Office.Postal_Dispatch}/${postalDispatchId}`;
    return this.http.delete<DispatchReceiveModel>(url, {headers: httpHeaders});
  }

  deletePostalDispatchs(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Postal_Dispatch + '/deletePostalDispatchs';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {postalDispatchIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


