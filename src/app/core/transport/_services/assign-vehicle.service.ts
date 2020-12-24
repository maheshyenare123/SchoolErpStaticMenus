import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { AssignVehicleModel } from '../_models/assign-vehicle.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AssignVehicleService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new AssignVehicle to the server
  createAssignVehicle(assignVehicle: AssignVehicleModel): Observable<AssignVehicleModel> {
    debugger
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<AssignVehicleModel>(Constants.URL.HOST_URL+Constants.Transports.AssignVehicle, assignVehicle, {headers: httpHeaders});
  }

  // READ
  getAllAssignVehicles(): Observable<AssignVehicleModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<AssignVehicleModel[]>(Constants.URL.HOST_URL+Constants.Transports.AssignVehicle, {headers: httpHeaders});
  }

  getAssignVehicleById(assignVehicleId: number): Observable<AssignVehicleModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<AssignVehicleModel>(Constants.URL.HOST_URL+Constants.Transports.AssignVehicle+ `/${assignVehicleId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findAssignVehicles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    debugger
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Transports.AssignVehicle ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the AssignVehicle on the server
  // updateAssignVehicle(assignVehicle: AssignVehicleModel): Observable<any> {
  //   const httpHeader = this.httpUtils.getHTTPHeaders();
  //   return this.http.put(Constants.URL.HOST_URL+Constants.Transports.AssignVehicle+'/'+assignVehicle.id, assignVehicle, {headers: httpHeader});
  // }

  updateAssignVehicle(assignVehicle: AssignVehicleModel): Observable<AssignVehicleModel> {
    debugger
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<AssignVehicleModel>(Constants.URL.HOST_URL+Constants.Transports.AssignVehicle, assignVehicle, {headers: httpHeaders});
  }


  // UPDATE Status
  updateStatusForAssignVehicle(assignVehicles: AssignVehicleModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      assignVehiclesForUpdate: assignVehicles,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Transports.AssignVehicle+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the AssignVehicle from the server
  // deleteAssignVehicle(assignVehicleId: number): Observable<AssignVehicleModel> {
  //   const httpHeaders = this.httpUtils.getHTTPHeaders();
  //   const url = `${Constants.URL.HOST_URL+Constants.Transports.AssignVehicle}/${assignVehicleId}`;
  //   return this.http.delete<AssignVehicleModel>(url, {headers: httpHeaders});
  // }

  deleteAssignVehicle(payloadItem: any): Observable<AssignVehicleModel> {
debugger

payloadItem

payloadItem = {
  "id": payloadItem.id,
  "routeId": payloadItem.routeId,
  "vehicles": payloadItem.vehicles
}
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {vehicleRouteDto: payloadItem};
    const option ={
      headers: httpHeaders,
      body
    }
    const url = `${Constants.URL.HOST_URL+Constants.Transports.AssignVehicle}`;
    return this.http.delete<AssignVehicleModel>(url,option);
  }

  deleteAssignVehicles(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Transports.AssignVehicle + '/deleteAssignVehicles';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {assignVehicleIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


