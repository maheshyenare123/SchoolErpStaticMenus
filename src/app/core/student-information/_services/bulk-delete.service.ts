import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StudentDtoModel } from '../_models/studentDto.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BulkDeleteService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new BulkDelete to the server
  createBulkDelete(bulkDelete: StudentDtoModel): Observable<StudentDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StudentDtoModel>(Constants.URL.HOST_URL+Constants.Student_Information.Bulk_Delete, bulkDelete, {headers: httpHeaders});
  }

  // READ
  getAllBulkDeletes(): Observable<StudentDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentDtoModel[]>(Constants.URL.HOST_URL+Constants.Student_Information.Bulk_Delete, {headers: httpHeaders});
  }

  getBulkDeleteById(bulkDeleteId: number): Observable<StudentDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentDtoModel>(Constants.URL.HOST_URL+Constants.Student_Information.Bulk_Delete+ `/${bulkDeleteId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findBulkDeletes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Student_Information.Bulk_Delete ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the BulkDelete on the server
  updateBulkDelete(bulkDelete: StudentDtoModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Student_Information.Bulk_Delete+'/'+bulkDelete.id, bulkDelete, {headers: httpHeaders});
  }

  // UPDATE Status
  updateStatusForBulkDelete(bulkDeletes: StudentDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      bulkDeletesForUpdate: bulkDeletes,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Bulk_Delete+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the BulkDelete from the server
  deleteBulkDelete(bulkDeleteId: number): Observable<StudentDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Student_Information.Bulk_Delete}/${bulkDeleteId}`;
    return this.http.delete<StudentDtoModel>(url,{headers: httpHeaders});
  }

  deleteBulkDeletes(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Bulk_Delete + '/deleteBulkDeletes';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {bulkDeleteIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


