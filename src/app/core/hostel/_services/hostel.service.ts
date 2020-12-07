import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { HostelModel } from '../_models/hostel.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HostelService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Hostel to the server
  createHostel(hostel: HostelModel): Observable<HostelModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<HostelModel>(Constants.URL.HOST_URL+Constants.Hostels.Hostel, hostel, {headers: httpHeaders});
  }

  // READ
  getAllHostels(): Observable<HostelModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<HostelModel[]>(Constants.URL.HOST_URL+Constants.Hostels.Hostel, {headers: httpHeaders});
  }

  getHostelById(hostelId: number): Observable<HostelModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<HostelModel>(Constants.URL.HOST_URL+Constants.Hostels.Hostel+ `/${hostelId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findHostels(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Hostels.Hostel ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the Hostel on the server
  updateHostel(hostel: HostelModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Hostels.Hostel+'/'+hostel.id, hostel, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForHostel(hostels: HostelModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      hostelsForUpdate: hostels,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Hostels.Hostel+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Hostel from the server
  deleteHostel(hostelId: number): Observable<HostelModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Hostels.Hostel}/${hostelId}`;
    return this.http.delete<HostelModel>(url, {headers: httpHeaders});
  }

  deleteHostels(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Hostels.Hostel + '/deleteHostels';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {hostelIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


