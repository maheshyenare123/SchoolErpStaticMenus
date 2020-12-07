import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ReferenceModel } from '../_models/reference.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new reference to the server
  createReference(reference: ReferenceModel): Observable<ReferenceModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ReferenceModel>(Constants.URL.HOST_URL+Constants.Front_Office.Reference, reference, {headers: httpHeaders});
  }

  // READ
  getAllReferences(): Observable<ReferenceModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ReferenceModel[]>(Constants.URL.HOST_URL+Constants.Front_Office.Reference, {headers: httpHeaders});
  }

  getReferenceById(referenceId: number): Observable<ReferenceModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ReferenceModel>(Constants.URL.HOST_URL+Constants.Front_Office.Reference+ `/${referenceId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findReferences(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Front_Office.Reference ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the reference on the server
  updateReference(reference: ReferenceModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Front_Office.Reference+'/'+reference.id, reference, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForReference(references: ReferenceModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      referencesForUpdate: references,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Reference+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the reference from the server
  deleteReference(referenceId: number): Observable<ReferenceModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Front_Office.Reference}/${referenceId}`;
    return this.http.delete<ReferenceModel>(url,{headers: httpHeaders});
  }

  deleteReferences(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Reference + '/deleteReferences';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {referenceIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


