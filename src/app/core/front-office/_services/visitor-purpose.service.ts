import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { VisitorPurposeModel } from '../_models/visitor-purpose.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VisitorPurposeService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new visitorPurpose to the server
  createVisitorPurpose(visitorPurpose: VisitorPurposeModel): Observable<VisitorPurposeModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<VisitorPurposeModel>(Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Purpose, visitorPurpose, {headers: httpHeaders});
  }

  // READ
  getAllVisitorPurposes(): Observable<VisitorPurposeModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<VisitorPurposeModel[]>(Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Purpose, {headers: httpHeaders});
  }

  getVisitorPurposeById(visitorPurposeId: number): Observable<VisitorPurposeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<VisitorPurposeModel>(Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Purpose+ `/${visitorPurposeId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findVisitorPurposes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Purpose ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the visitorPurpose on the server
  updateVisitorPurpose(visitorPurpose: VisitorPurposeModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Purpose+'/'+visitorPurpose.id, visitorPurpose, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForVisitorPurpose(visitorPurposes: VisitorPurposeModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      visitorPurposesForUpdate: visitorPurposes,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Purpose+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the visitorPurpose from the server
  deleteVisitorPurpose(visitorPurposeId: number): Observable<VisitorPurposeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Purpose}/${visitorPurposeId}`;
    return this.http.delete<VisitorPurposeModel>(url, {headers: httpHeaders});
  }

  deleteVisitorPurposes(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Purpose + '/deleteVisitorPurposes';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {visitorPurposeIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


