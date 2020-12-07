import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { AddItemModel } from '../_models/add-item.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddItemService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new AddItem to the server
  createAddItem(addItem: AddItemModel): Observable<AddItemModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<AddItemModel>(Constants.URL.HOST_URL+Constants.Inventory.AddItem, addItem, {headers: httpHeaders});
  }

  // READ
  getAllAddItems(): Observable<AddItemModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<AddItemModel[]>(Constants.URL.HOST_URL+Constants.Inventory.AddItem, {headers: httpHeaders});
  }

  getAddItemById(addItemId: number): Observable<AddItemModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<AddItemModel>(Constants.URL.HOST_URL+Constants.Inventory.AddItem+ `/${addItemId}`, {headers: httpHeaders});
  }

  getAllItemsByItemCategoryId(id): Observable<AddItemModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<AddItemModel[]>(Constants.URL.HOST_URL+Constants.Inventory.AddItem+"/itemcategory/"+id, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findAddItems(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Inventory.AddItem ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the AddItem on the server
  updateAddItem(addItem: AddItemModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Inventory.AddItem+'/'+addItem.id, addItem, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForAddItem(addItems: AddItemModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      addItemsForUpdate: addItems,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Inventory.AddItem+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the AddItem from the server
  deleteAddItem(addItemId: number): Observable<AddItemModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Inventory.AddItem}/${addItemId}`;
    return this.http.delete<AddItemModel>(url, {headers: httpHeaders});
  }

  deleteAddItems(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Inventory.AddItem + '/deleteAddItems';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {addItemIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


