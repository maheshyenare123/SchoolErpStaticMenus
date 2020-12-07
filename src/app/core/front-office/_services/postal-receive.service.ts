import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { DispatchReceiveModel } from '../_models/dispose-dispatch-receive.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostalReceiveService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new postalReceive to the server
  createPostalReceive(postalReceive: DispatchReceiveModel): Observable<DispatchReceiveModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<DispatchReceiveModel>(Constants.URL.HOST_URL+Constants.Front_Office.Postal_Receive, postalReceive, {headers: httpHeaders});
  }

  // READ
  getAllPostalReceives(): Observable<DispatchReceiveModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<DispatchReceiveModel[]>(Constants.URL.HOST_URL+Constants.Front_Office.Postal_Receive, {headers: httpHeaders});
  }

  getPostalReceiveById(postalReceiveId: number): Observable<DispatchReceiveModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<DispatchReceiveModel>(Constants.URL.HOST_URL+Constants.Front_Office.Postal_Receive+ `/${postalReceiveId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findPostalReceives(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
   debugger;
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const httpParams =new HttpParams()
    .set('pageNo', queryParams.pageNumber.toString())
    .set('pageSize', queryParams.pageSize.toString())
    .set('sortBy', 'id')
    .set('type', Constants.RECEIVE);





    const url =Constants.URL.HOST_URL+Constants.Front_Office.Postal_Receive ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the postalReceive on the server
  updatePostalReceive(postalReceive: DispatchReceiveModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Front_Office.Postal_Receive+'/'+postalReceive.id, postalReceive, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForPostalReceive(postalReceives: DispatchReceiveModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      postalReceivesForUpdate: postalReceives,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Postal_Receive+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the postalReceive from the server
  deletePostalReceive(postalReceiveId: number): Observable<DispatchReceiveModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Front_Office.Postal_Receive}/${postalReceiveId}`;
    return this.http.delete<DispatchReceiveModel>(url,{headers: httpHeaders});
  }

  deletePostalReceives(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Postal_Receive + '/deletePostalReceives';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {postalReceiveIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


