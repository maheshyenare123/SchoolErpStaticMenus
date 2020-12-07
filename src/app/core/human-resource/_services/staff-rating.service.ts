import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StaffRatingModel } from '../_models/staff-rating.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StaffRatingService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new StaffRating to the server
  createStaffRating(staffRating: StaffRatingModel): Observable<StaffRatingModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StaffRatingModel>(Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Rating, staffRating, {headers: httpHeaders});
  }

  // READ
  getAllStaffRatings(): Observable<StaffRatingModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StaffRatingModel[]>(Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Rating, {headers: httpHeaders});
  }

  getStaffRatingById(staffRatingId: number): Observable<StaffRatingModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StaffRatingModel>(Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Rating+ `/${staffRatingId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findStaffRatings(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Rating ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the StaffRating on the server
  updateStaffRating(staffRating: StaffRatingModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Rating+'/'+staffRating.id, staffRating, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForStaffRating(staffRatings: StaffRatingModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      staffRatingsForUpdate: staffRatings,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Rating+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the StaffRating from the server
  deleteStaffRating(staffRatingId: number): Observable<StaffRatingModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Rating}/${staffRatingId}`;
    return this.http.delete<StaffRatingModel>(url,{headers: httpHeaders});
  }

  deleteStaffRatings(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Human_Resource.Staff_Rating + '/deleteStaffRatings';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {staffRatingIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


