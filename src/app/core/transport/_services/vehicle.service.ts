import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { VehicleModel } from '../_models/vehicle.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Vehicle to the server
  createVehicle(vehicle: VehicleModel): Observable<VehicleModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<VehicleModel>(Constants.URL.HOST_URL+Constants.Transports.Vehicle, vehicle, {headers: httpHeaders});
  }

  // READ
  getAllVehicles(): Observable<VehicleModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<VehicleModel[]>(Constants.URL.HOST_URL+Constants.Transports.Vehicle, {headers: httpHeaders});
  }

  getVehicleById(vehicleId: number): Observable<VehicleModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<VehicleModel>(Constants.URL.HOST_URL+Constants.Transports.Vehicle+ `/${vehicleId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findVehicles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Transports.Vehicle ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the Vehicle on the server
  updateVehicle(vehicle: VehicleModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Transports.Vehicle+'/'+vehicle.id, vehicle, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForVehicle(vehicles: VehicleModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      vehiclesForUpdate: vehicles,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Transports.Vehicle+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Vehicle from the server
  deleteVehicle(vehicleId: number): Observable<VehicleModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Transports.Vehicle}/${vehicleId}`;
    return this.http.delete<VehicleModel>(url, {headers: httpHeaders});
  }

  deleteVehicles(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Transports.Vehicle + '/deleteVehicles';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {vehicleIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


