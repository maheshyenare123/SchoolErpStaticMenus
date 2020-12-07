import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { DisableReasonModel } from '../_models/disableReason.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DisableReasonService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new DisableReason to the server
  createDisableReason(disableReason: DisableReasonModel): Observable<DisableReasonModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<DisableReasonModel>(Constants.URL.HOST_URL+Constants.Student_Information.Disable_Reason, disableReason, {headers: httpHeaders});
  }

  // READ
  getAllDisableReasons(): Observable<DisableReasonModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<DisableReasonModel[]>(Constants.URL.HOST_URL+Constants.Student_Information.Disable_Reason, {headers: httpHeaders});
  }

  getDisableReasonById(disableReasonId: number): Observable<DisableReasonModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<DisableReasonModel>(Constants.URL.HOST_URL+Constants.Student_Information.Disable_Reason+ `/${disableReasonId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findDisableReasons(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Student_Information.Disable_Reason;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the disableReason on the server
  updateDisableReason(disableReason: DisableReasonModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Student_Information.Disable_Reason+'/'+disableReason.id, disableReason, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForDisableReason(disableReasons: DisableReasonModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      disableReasonsForUpdate: disableReasons,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Disable_Reason+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the disableReason from the server
  deleteDisableReason(disableReasonId: number): Observable<DisableReasonModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Student_Information.Disable_Reason}/${disableReasonId}`;
    return this.http.delete<DisableReasonModel>(url, {headers: httpHeaders});
  }

  deleteDisableReasons(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Disable_Reason + '/deleteDisableReasons';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {disableReasonIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


