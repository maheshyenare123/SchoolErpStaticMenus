import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ItemSupplierModel } from '../_models/item-supplier.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemSupplierService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new ItemSupplier to the server
  createItemSupplier(itemSupplier: ItemSupplierModel): Observable<ItemSupplierModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ItemSupplierModel>(Constants.URL.HOST_URL+Constants.Inventory.ItemSupplier, itemSupplier, {headers: httpHeaders});
  }

  // READ
  getAllItemSuppliers(): Observable<ItemSupplierModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ItemSupplierModel[]>(Constants.URL.HOST_URL+Constants.Inventory.ItemSupplier, {headers: httpHeaders});
  }

  getItemSupplierById(itemSupplierId: number): Observable<ItemSupplierModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ItemSupplierModel>(Constants.URL.HOST_URL+Constants.Inventory.ItemSupplier+ `/${itemSupplierId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findItemSuppliers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Inventory.ItemSupplier ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the ItemSupplier on the server
  updateItemSupplier(itemSupplier: ItemSupplierModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Inventory.ItemSupplier+'/'+itemSupplier.id, itemSupplier, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForItemSupplier(itemSuppliers: ItemSupplierModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      itemSuppliersForUpdate: itemSuppliers,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Inventory.ItemSupplier+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the ItemSupplier from the server
  deleteItemSupplier(itemSupplierId: number): Observable<ItemSupplierModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Inventory.ItemSupplier}/${itemSupplierId}`;
    return this.http.delete<ItemSupplierModel>(url, {headers: httpHeaders});
  }

  deleteItemSuppliers(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Inventory.ItemSupplier + '/deleteItemSuppliers';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {itemSupplierIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


