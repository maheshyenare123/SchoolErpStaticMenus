import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { RouteModel } from '../_models/route.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Route to the server
  createRoute(route: RouteModel): Observable<RouteModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<RouteModel>(Constants.URL.HOST_URL+Constants.Transports.Route, route, {headers: httpHeaders});
  }

  // READ
  getAllRoutes(): Observable<RouteModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<RouteModel[]>(Constants.URL.HOST_URL+Constants.Transports.Route, {headers: httpHeaders});
  }

  getRouteById(routeId: number): Observable<RouteModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<RouteModel>(Constants.URL.HOST_URL+Constants.Transports.Route+ `/${routeId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findRoutes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Transports.Route ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the Route on the server
  updateRoute(route: RouteModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Transports.Route+'/'+route.id, route, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForRoute(routes: RouteModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      routesForUpdate: routes,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Transports.Route+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Route from the server
  deleteRoute(routeId: number): Observable<RouteModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Transports.Route}/${routeId}`;
    return this.http.delete<RouteModel>(url, {headers: httpHeaders});
  }

  deleteRoutes(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Transports.Route + '/deleteRoutes';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {routeIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


