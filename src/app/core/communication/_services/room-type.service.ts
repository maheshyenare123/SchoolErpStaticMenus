import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { RoomTypeModel } from '../_models/room-type.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new RoomType to the server
  createRoomType(roomType: RoomTypeModel): Observable<RoomTypeModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<RoomTypeModel>(Constants.URL.HOST_URL+Constants.Hostels.RoomType, roomType, {headers: httpHeaders});
  }

  // READ
  getAllRoomTypes(): Observable<RoomTypeModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<RoomTypeModel[]>(Constants.URL.HOST_URL+Constants.Hostels.RoomType, {headers: httpHeaders});
  }

  getRoomTypeById(roomTypeId: number): Observable<RoomTypeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<RoomTypeModel>(Constants.URL.HOST_URL+Constants.Hostels.RoomType+ `/${roomTypeId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findRoomTypes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Hostels.RoomType ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the RoomType on the server
  updateRoomType(roomType: RoomTypeModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Hostels.RoomType+'/'+roomType.id, roomType, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForRoomType(roomTypes: RoomTypeModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      roomTypesForUpdate: roomTypes,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Hostels.RoomType+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the RoomType from the server
  deleteRoomType(roomTypeId: number): Observable<RoomTypeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Hostels.RoomType}/${roomTypeId}`;
    return this.http.delete<RoomTypeModel>(url, {headers: httpHeaders});
  }

  deleteRoomTypes(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Hostels.RoomType + '/deleteRoomTypes';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {roomTypeIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


