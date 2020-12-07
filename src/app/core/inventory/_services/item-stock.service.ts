import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ItemStockModel } from '../_models/item-stock.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemStockService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new ItemStock to the server
  createItemStock(itemStock: ItemStockModel): Observable<ItemStockModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ItemStockModel>(Constants.URL.HOST_URL+Constants.Inventory.ItemStock, itemStock, {headers: httpHeaders});
  }

  // READ
  getAllItemStocks(): Observable<ItemStockModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ItemStockModel[]>(Constants.URL.HOST_URL+Constants.Inventory.ItemStock, {headers: httpHeaders});
  }

  getItemStockById(itemStockId: number): Observable<ItemStockModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ItemStockModel>(Constants.URL.HOST_URL+Constants.Inventory.ItemStock+ `/${itemStockId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findItemStocks(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Inventory.ItemStock ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the ItemStock on the server
  updateItemStock(itemStock: ItemStockModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Inventory.ItemStock+'/'+itemStock.id, itemStock, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForItemStock(itemStocks: ItemStockModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      itemStocksForUpdate: itemStocks,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Inventory.ItemStock+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the ItemStock from the server
  deleteItemStock(itemStockId: number): Observable<ItemStockModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Inventory.ItemStock}/${itemStockId}`;
    return this.http.delete<ItemStockModel>(url, {headers: httpHeaders});
  }

  deleteItemStocks(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Inventory.ItemStock + '/deleteItemStocks';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {itemStockIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


