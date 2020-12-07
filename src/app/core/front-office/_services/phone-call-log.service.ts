import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { GeneralCallModel } from '../_models/general-call.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PhoneCallLogService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new phoneCallLog to the server
  createPhoneCallLog(phoneCallLog: GeneralCallModel): Observable<GeneralCallModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<GeneralCallModel>(Constants.URL.HOST_URL+Constants.Front_Office.Phone_Call_Log, phoneCallLog, {headers: httpHeaders});
  }

  // READ
  getAllPhoneCallLogs(): Observable<GeneralCallModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<GeneralCallModel[]>(Constants.URL.HOST_URL+Constants.Front_Office.Phone_Call_Log, {headers: httpHeaders});
  }

  getPhoneCallLogById(phoneCallLogId: number): Observable<GeneralCallModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<GeneralCallModel>(Constants.URL.HOST_URL+Constants.Front_Office.Phone_Call_Log+ `/${phoneCallLogId}`,{headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findPhoneCallLogs(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Front_Office.Phone_Call_Log ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the phoneCallLog on the server
  updatePhoneCallLog(phoneCallLog: GeneralCallModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Front_Office.Phone_Call_Log+'/'+phoneCallLog.id, phoneCallLog, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForPhoneCallLog(phoneCallLogs: GeneralCallModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      phoneCallLogsForUpdate: phoneCallLogs,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Phone_Call_Log+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the phoneCallLog from the server
  deletePhoneCallLog(phoneCallLogId: number): Observable<GeneralCallModel> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Front_Office.Phone_Call_Log}/${phoneCallLogId}`;
    return this.http.delete<GeneralCallModel>(url,{headers: httpHeader});
  }

  deletePhoneCallLogs(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Phone_Call_Log + '/deletePhoneCallLogs';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {phoneCallLogIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


