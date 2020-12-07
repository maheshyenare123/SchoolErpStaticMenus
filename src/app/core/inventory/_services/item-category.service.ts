import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ItemCategoryModel } from '../_models/item-category.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemCategoryService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new ItemCategory to the server
  createItemCategory(itemCategory: ItemCategoryModel): Observable<ItemCategoryModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ItemCategoryModel>(Constants.URL.HOST_URL+Constants.Inventory.ItemCategory, itemCategory, {headers: httpHeaders});
  }

  // READ
  getAllItemCategorys(): Observable<ItemCategoryModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ItemCategoryModel[]>(Constants.URL.HOST_URL+Constants.Inventory.ItemCategory, {headers: httpHeaders});
  }

  getItemCategoryById(itemCategoryId: number): Observable<ItemCategoryModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ItemCategoryModel>(Constants.URL.HOST_URL+Constants.Inventory.ItemCategory+ `/${itemCategoryId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findItemCategorys(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Inventory.ItemCategory ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the ItemCategory on the server
  updateItemCategory(itemCategory: ItemCategoryModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Inventory.ItemCategory+'/'+itemCategory.id, itemCategory, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForItemCategory(itemCategorys: ItemCategoryModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      itemCategorysForUpdate: itemCategorys,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Inventory.ItemCategory+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the ItemCategory from the server
  deleteItemCategory(itemCategoryId: number): Observable<ItemCategoryModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Inventory.ItemCategory}/${itemCategoryId}`;
    return this.http.delete<ItemCategoryModel>(url, {headers: httpHeaders});
  }

  deleteItemCategorys(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Inventory.ItemCategory + '/deleteItemCategorys';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {itemCategoryIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


