import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { FeesTypeModel } from '../_models/fees-type.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FeesTypeService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new FeesType to the server
  createFeesType(feesType: FeesTypeModel): Observable<FeesTypeModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<FeesTypeModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Type, feesType, {headers: httpHeaders});
  }

  // READ
  getAllFeesTypes(): Observable<FeesTypeModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<FeesTypeModel[]>(Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Type, {headers: httpHeaders});
  }

  getFeesTypeById(feesTypeId: number): Observable<FeesTypeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<FeesTypeModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Type+ `/${feesTypeId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findFeesTypes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Type ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the FeesType on the server
  updateFeesType(feesType: FeesTypeModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Type+'/'+feesType.id, feesType, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForFeesType(feesTypes: FeesTypeModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      feesTypesForUpdate: feesTypes,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Type+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the FeesType from the server
  deleteFeesType(feesTypeId: number): Observable<FeesTypeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Type}/${feesTypeId}`;
    return this.http.delete<FeesTypeModel>(url, {headers: httpHeaders});
  }

  deleteFeesTypes(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Type + '/deleteFeesTypes';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {feesTypeIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


