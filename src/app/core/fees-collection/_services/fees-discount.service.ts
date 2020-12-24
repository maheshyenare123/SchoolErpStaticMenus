import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { FeesDiscountModel } from '../_models/fees-discount.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FeesDiscountService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new FeesDiscount to the server
  createFeesDiscount(feesDiscount: FeesDiscountModel): Observable<FeesDiscountModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<FeesDiscountModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Discount, feesDiscount, {headers: httpHeaders});
  }

  // READ
  getAllFeesDiscounts(): Observable<FeesDiscountModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<FeesDiscountModel[]>(Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Discount, {headers: httpHeaders});
  }

  getFeesDiscountById(feesDiscountId: number): Observable<FeesDiscountModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<FeesDiscountModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Discount+ `/${feesDiscountId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findFeesDiscounts(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Discount ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the FeesDiscount on the server
  updateFeesDiscount(feesDiscount: FeesDiscountModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Discount+'/'+feesDiscount.id, feesDiscount, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForFeesDiscount(feesDiscounts: FeesDiscountModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      feesDiscountsForUpdate: feesDiscounts,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Discount+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the FeesDiscount from the server
  deleteFeesDiscount(feesDiscountId: number): Observable<FeesDiscountModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Discount}/${feesDiscountId}`;
    return this.http.delete<FeesDiscountModel>(url, {headers: httpHeaders});
  }

  deleteFeesDiscounts(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.Fees_Discount + '/deleteFeesDiscounts';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {feesDiscountIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


