import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { EmailModel } from '../_models/email.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Email to the server
  createEmail(email: EmailModel): Observable<EmailModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<EmailModel>(Constants.URL.HOST_URL+Constants.System_Settings.Email, email, {headers: httpHeaders});
  }

  // READ
  getAllEmails(): Observable<EmailModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<EmailModel[]>(Constants.URL.HOST_URL+Constants.System_Settings.Email, {headers: httpHeaders});
  }
 

  getEmailById(classId: number): Observable<EmailModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<EmailModel>(Constants.URL.HOST_URL+Constants.System_Settings.Email+ `/${classId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findEmails(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.System_Settings.Email ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the Email on the server
  updateEmail(email: EmailModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.System_Settings.Email+'/'+email, email, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForEmail(email: EmailModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      emailForUpdate: email,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.System_Settings.Email+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Email from the server
  deleteEmail(classId: number): Observable<EmailModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.System_Settings.Email}/${classId}`;
    return this.http.delete<EmailModel>(url, {headers: httpHeaders});
  }

  deleteEmails(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.System_Settings.Email + '/deleteEmails';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {classIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


