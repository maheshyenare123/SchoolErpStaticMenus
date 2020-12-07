import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { SessionModel } from '../_models/session.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Session to the server
  createSession(session: SessionModel): Observable<SessionModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<SessionModel>(Constants.URL.HOST_URL+Constants.System_Settings.Session, session, {headers: httpHeaders});
  }

  // READ
  getAllSessions(): Observable<SessionModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SessionModel[]>(Constants.URL.HOST_URL+Constants.System_Settings.Session, {headers: httpHeaders});
  }
 

  getSessionById(classId: number): Observable<SessionModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SessionModel>(Constants.URL.HOST_URL+Constants.System_Settings.Session+ `/${classId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findSessions(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.System_Settings.Session ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the Session on the server
  updateSession(session: SessionModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.System_Settings.Session+'/'+session.id, session, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForSession(session: SessionModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      sessionForUpdate: session,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.System_Settings.Session+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Session from the server
  deleteSession(classId: number): Observable<SessionModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.System_Settings.Session}/${classId}`;
    return this.http.delete<SessionModel>(url, {headers: httpHeaders});
  }

  deleteSessions(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.System_Settings.Session + '/deleteSessions';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {classIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


