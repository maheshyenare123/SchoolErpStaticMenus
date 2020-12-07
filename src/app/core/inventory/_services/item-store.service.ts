import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ItemStoreModel } from '../_models/item-store.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemStoreService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new ItemStore to the server
  createItemStore(itemStore: ItemStoreModel): Observable<ItemStoreModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ItemStoreModel>(Constants.URL.HOST_URL+Constants.Inventory.ItemStore, itemStore, {headers: httpHeaders});
  }

  // READ
  getAllItemStores(): Observable<ItemStoreModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ItemStoreModel[]>(Constants.URL.HOST_URL+Constants.Inventory.ItemStore, {headers: httpHeaders});
  }

  getItemStoreById(itemStoreId: number): Observable<ItemStoreModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ItemStoreModel>(Constants.URL.HOST_URL+Constants.Inventory.ItemStore+ `/${itemStoreId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findItemStores(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Inventory.ItemStore ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the ItemStore on the server
  updateItemStore(itemStore: ItemStoreModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Inventory.ItemStore+'/'+itemStore.id, itemStore, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForItemStore(itemStores: ItemStoreModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      itemStoresForUpdate: itemStores,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Inventory.ItemStore+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the ItemStore from the server
  deleteItemStore(itemStoreId: number): Observable<ItemStoreModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Inventory.ItemStore}/${itemStoreId}`;
    return this.http.delete<ItemStoreModel>(url, {headers: httpHeaders});
  }

  deleteItemStores(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Inventory.ItemStore + '/deleteItemStores';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {itemStoreIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


