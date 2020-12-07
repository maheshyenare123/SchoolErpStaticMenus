import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { CategoryDtoModel } from '../_models/categoryDto.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new category to the server
  createCategory(category: CategoryDtoModel): Observable<CategoryDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<CategoryDtoModel>(Constants.URL.HOST_URL+Constants.Student_Information.Student_Category, category, {headers: httpHeaders});
  }

  // READ
  getAllCategorys(): Observable<CategoryDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<CategoryDtoModel[]>(Constants.URL.HOST_URL+Constants.Student_Information.Student_Category,{headers: httpHeaders});
  }

  getCategoryById(categoryId: number): Observable<CategoryDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<CategoryDtoModel>(Constants.URL.HOST_URL+Constants.Student_Information.Student_Category+ `/${categoryId}`,{headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findCategorys(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Student_Information.Student_Category;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the category on the server
  updateCategory(category: CategoryDtoModel): Observable<any> {
    const httpHeaders= this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Student_Information.Student_Category+'/'+category.id, category, {headers: httpHeaders});
  }

  // UPDATE Status
  updateStatusForCategory(categorys: CategoryDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      categorysForUpdate: categorys,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Student_Category+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the category from the server
  deleteCategory(categoryId: number): Observable<CategoryDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Student_Information.Student_Category}/${categoryId}`;
    return this.http.delete<CategoryDtoModel>(url, {headers: httpHeaders});
  }

  deleteCategorys(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Student_Category + '/deleteCategorys';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {categoryIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


