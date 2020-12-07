import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ComplaintTypeModel } from '../_models/complaint-type.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ComplaintTypeService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new complaintType to the server
  createComplaintType(complaintType: ComplaintTypeModel): Observable<ComplaintTypeModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ComplaintTypeModel>(Constants.URL.HOST_URL+Constants.Front_Office.ComplainType, complaintType, {headers: httpHeaders});
  }

  // READ
  getAllComplaintTypes(): Observable<ComplaintTypeModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ComplaintTypeModel[]>(Constants.URL.HOST_URL+Constants.Front_Office.ComplainType, {headers: httpHeaders});
  }

  getComplaintTypeById(complaintTypeId: number): Observable<ComplaintTypeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ComplaintTypeModel>(Constants.URL.HOST_URL+Constants.Front_Office.ComplainType+ `/${complaintTypeId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findComplaintTypes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Front_Office.ComplainType ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the complaintType on the server
  updateComplaintType(complaintType: ComplaintTypeModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Front_Office.ComplainType+'/'+complaintType.id, complaintType, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForComplaintType(complaintTypes: ComplaintTypeModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      complaintTypesForUpdate: complaintTypes,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Front_Office.ComplainType+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the complaintType from the server
  deleteComplaintType(complaintTypeId: number): Observable<ComplaintTypeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Front_Office.ComplainType}/${complaintTypeId}`;
    return this.http.delete<ComplaintTypeModel>(url, {headers: httpHeaders});
  }

  deleteComplaintTypes(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Front_Office.ComplainType + '/deleteComplaintTypes';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {complaintTypeIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


