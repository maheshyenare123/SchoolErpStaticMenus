import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { HostelRoomModel } from '../_models/hostel-room.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HostelRoomService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new HostelRoom to the server
  createHostelRoom(hostelRoom: HostelRoomModel): Observable<HostelRoomModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<HostelRoomModel>(Constants.URL.HOST_URL+Constants.Hostels.HostelRoom, hostelRoom, {headers: httpHeaders});
  }

  // READ
  getAllHostelRooms(): Observable<HostelRoomModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<HostelRoomModel[]>(Constants.URL.HOST_URL+Constants.Hostels.HostelRoom, {headers: httpHeaders});
  }

  getHostelRoomById(hostelRoomId: number): Observable<HostelRoomModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<HostelRoomModel>(Constants.URL.HOST_URL+Constants.Hostels.HostelRoom+ `/${hostelRoomId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findHostelRooms(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Hostels.HostelRoom ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the HostelRoom on the server
  updateHostelRoom(hostelRoom: HostelRoomModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Hostels.HostelRoom+'/'+hostelRoom.id, hostelRoom, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForHostelRoom(hostelRooms: HostelRoomModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      hostelRoomsForUpdate: hostelRooms,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Hostels.HostelRoom+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the HostelRoom from the server
  deleteHostelRoom(hostelRoomId: number): Observable<HostelRoomModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Hostels.HostelRoom}/${hostelRoomId}`;
    return this.http.delete<HostelRoomModel>(url, {headers: httpHeaders});
  }

  deleteHostelRooms(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Hostels.HostelRoom + '/deleteHostelRooms';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {hostelRoomIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


