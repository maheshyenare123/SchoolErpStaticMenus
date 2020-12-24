import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ComplaintModel } from '../_models/complaint.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new complaint to the server
  createComplaint(complaint: ComplaintModel): Observable<ComplaintModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ComplaintModel>(Constants.URL.HOST_URL+Constants.Front_Office.Complain, complaint, {headers: httpHeaders});
  }

  // READ
  getAllComplaints(): Observable<ComplaintModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ComplaintModel[]>(Constants.URL.HOST_URL+Constants.Front_Office.Complain, {headers: httpHeaders});
  }

  getComplaintById(complaintId: number): Observable<ComplaintModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ComplaintModel>(Constants.URL.HOST_URL+Constants.Front_Office.Complain+ `/${complaintId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findComplaints(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Front_Office.Complain ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the complaint on the server
  updateComplaint(complaint: ComplaintModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Front_Office.Complain+'/'+complaint.id, complaint, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForComplaint(complaints: ComplaintModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      complaintsForUpdate: complaints,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Complain+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the complaint from the server
  deleteComplaint(complaintId: number): Observable<ComplaintModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Front_Office.Complain}/${complaintId}`;
    return this.http.delete<ComplaintModel>(url, {headers: httpHeaders});
  }

  deleteComplaints(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Complain + '/deleteComplaints';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {complaintIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


