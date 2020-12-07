import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { SmsModel } from '../_models/sms.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Sms to the server
  createSms(sms: SmsModel): Observable<SmsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<SmsModel>(Constants.URL.HOST_URL+Constants.System_Settings.Sms, sms, {headers: httpHeaders});
  }

  // READ
  getAllSmss(): Observable<SmsModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SmsModel[]>(Constants.URL.HOST_URL+Constants.System_Settings.Sms, {headers: httpHeaders});
  }
 

  getSmsById(classId: number): Observable<SmsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SmsModel>(Constants.URL.HOST_URL+Constants.System_Settings.Sms+ `/${classId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findSmss(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.System_Settings.Sms ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the Sms on the server
  updateSms(sms: SmsModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.System_Settings.Sms+'/'+sms, sms, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForSms(sms: SmsModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      smsForUpdate: sms,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.System_Settings.Sms+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Sms from the server
  deleteSms(classId: number): Observable<SmsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.System_Settings.Sms}/${classId}`;
    return this.http.delete<SmsModel>(url, {headers: httpHeaders});
  }

  deleteSmss(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.System_Settings.Sms + '/deleteSmss';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {classIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


