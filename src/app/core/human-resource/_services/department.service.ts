import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { DepartmentModel } from '../_models/department.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Department to the server
  createDepartment(department: DepartmentModel): Observable<DepartmentModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<DepartmentModel>(Constants.URL.HOST_URL+Constants.Human_Resource.Department, department, {headers: httpHeaders});
  }

  // READ
  getAllDepartments(): Observable<DepartmentModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<DepartmentModel[]>(Constants.URL.HOST_URL+Constants.Human_Resource.Department, {headers: httpHeaders});
  }

  getDepartmentById(departmentId: number): Observable<DepartmentModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<DepartmentModel>(Constants.URL.HOST_URL+Constants.Human_Resource.Department+ `/${departmentId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findDepartments(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Human_Resource.Department ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the Department on the server
  updateDepartment(department: DepartmentModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Human_Resource.Department+'/'+department.id, department, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForDepartment(departments: DepartmentModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      departmentsForUpdate: departments,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Human_Resource.Department+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Department from the server
  deleteDepartment(departmentId: number): Observable<DepartmentModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Human_Resource.Department}/${departmentId}`;
    return this.http.delete<DepartmentModel>(url,{headers: httpHeaders});
  }

  deleteDepartments(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Human_Resource.Department + '/deleteDepartments';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {departmentIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


