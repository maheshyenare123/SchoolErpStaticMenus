import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { FeesReminderModel } from '../_models/fees-reminder.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FeesReminderService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new FeesReminder to the server
  createFeesReminder(feesReminder: FeesReminderModel): Observable<FeesReminderModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<FeesReminderModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.FeesReminder, feesReminder, {headers: httpHeaders});
  }

  // READ
  getAllFeesReminders(): Observable<FeesReminderModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<FeesReminderModel[]>(Constants.URL.HOST_URL+Constants.Fees_Collection.FeesReminder, {headers: httpHeaders});
  }

  getFeesReminderById(feesReminderId: number): Observable<FeesReminderModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<FeesReminderModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.FeesReminder+ `/${feesReminderId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findFeesReminders(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Fees_Collection.FeesReminder ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the FeesReminder on the server
  updateFeesReminder(feesReminder: FeesReminderModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Fees_Collection.FeesReminder+'/'+feesReminder.id, feesReminder, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForFeesReminder(feesReminders: FeesReminderModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      feesRemindersForUpdate: feesReminders,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.FeesReminder+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the FeesReminder from the server
  deleteFeesReminder(feesReminderId: number): Observable<FeesReminderModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Fees_Collection.FeesReminder}/${feesReminderId}`;
    return this.http.delete<FeesReminderModel>(url, {headers: httpHeaders});
  }

  deleteFeesReminders(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.FeesReminder + '/deleteFeesReminders';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {feesReminderIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


