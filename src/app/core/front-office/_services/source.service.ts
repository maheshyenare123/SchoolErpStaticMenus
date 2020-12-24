import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { SourceModel } from '../_models/source.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SourceService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new source to the server
  createSource(source: SourceModel): Observable<SourceModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<SourceModel>(Constants.URL.HOST_URL+Constants.Front_Office.Source, source, {headers: httpHeaders});
  }

  // READ
  getAllSources(): Observable<SourceModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SourceModel[]>(Constants.URL.HOST_URL+Constants.Front_Office.Source, {headers: httpHeaders});
  }

  getSourceById(sourceId: number): Observable<SourceModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SourceModel>(Constants.URL.HOST_URL+Constants.Front_Office.Source+ `/${sourceId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findSources(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Front_Office.Source ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the source on the server
  updateSource(source: SourceModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Front_Office.Source+'/'+source.id, source, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForSource(sources: SourceModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      sourcesForUpdate: sources,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Source+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the source from the server
  deleteSource(sourceId: number): Observable<SourceModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Front_Office.Source}/${sourceId}`;
    return this.http.delete<SourceModel>(url, {headers: httpHeaders});
  }

  deleteSources(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Source + '/deleteSources';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {sourceIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


