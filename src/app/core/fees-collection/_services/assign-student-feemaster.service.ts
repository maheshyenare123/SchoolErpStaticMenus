import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { Observable } from 'rxjs';
import { AssignFeemasterStudentRequestDtoModel } from '../_models/assign-feemaster-student-request-dto.model'


@Injectable({
  providedIn: 'root'
})
export class AssignStudentFeemasterService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new AssignStudentFeemaster to the server
  createAssignStudentFeemaster(assignStudentFeemaster: AssignFeemasterStudentRequestDtoModel): Observable<AssignFeemasterStudentRequestDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<AssignFeemasterStudentRequestDtoModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeemaster, assignStudentFeemaster, {headers: httpHeaders});
  }

  // READ
  getAllAssignStudentFeemasters(): Observable<AssignFeemasterStudentRequestDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<AssignFeemasterStudentRequestDtoModel[]>(Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeemaster, {headers: httpHeaders});
  }

  getAssignStudentFeemasterById(assignStudentFeemasterId: number): Observable<AssignFeemasterStudentRequestDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<AssignFeemasterStudentRequestDtoModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeemaster+ `/${assignStudentFeemasterId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findAssignStudentFeemasters(queryParams,classId:number,sectionId:number,category:number,gender:string,rte:string,feeGroupId:number): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
   // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
//
debugger
if(gender != null && rte != null){
  const httpParams =new HttpParams()
  
  .set('categoryId', category.toString())
  .set('classesId', classId.toString())
  .set('rte', rte.toString())
  .set('gender', gender.toString())
  .set('pageNo', queryParams.pageNo.toString())
  .set('pageSize', queryParams.itemsPerPage.toString())
  .set('sectionId', sectionId.toString())
  .set('sortBy', 'id');
  const url =Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeediscount+'/'+feeGroupId ;
  return this.http.get<QueryResultsModel>(url, {
    headers: httpHeaders,
    params: httpParams
  });
}

if(gender == null && rte == null){
  const httpParams =new HttpParams()
  
  .set('categoryId', category.toString())
  .set('classesId', classId.toString())
  .set('pageNo', queryParams.pageNo.toString())
  .set('pageSize', queryParams.itemsPerPage.toString())
  .set('sectionId', sectionId.toString())
  .set('sortBy', 'id');
  const url =Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeemaster+'/'+feeGroupId ;
  return this.http.get<QueryResultsModel>(url, {
    headers: httpHeaders,
    params: httpParams
  });
}


    if(gender == null){
      const httpParams =new HttpParams()
      .set('classesId', classId.toString())
      .set('categoryId', category.toString())
      .set('rte', rte.toString())
      .set('pageNo', queryParams.pageNo.toString())
      .set('pageSize', queryParams.itemsPerPage.toString())
      .set('sectionId', sectionId.toString())
      .set('sortBy', 'id');

      const url =Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeemaster+'/'+feeGroupId ;
      return this.http.get<QueryResultsModel>(url, {
        headers: httpHeaders,
        params: httpParams
      });
    }
		if(rte == null){
      const httpParams =new HttpParams()
      .set('classesId', classId.toString())
      .set('gender', gender.toString())
      .set('categoryId', category.toString())
      .set('pageNo', queryParams.pageNo.toString())
      .set('pageSize', queryParams.itemsPerPage.toString())
      .set('sectionId', sectionId.toString())
      .set('sortBy', 'id');

      const url =Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeemaster+'/'+feeGroupId ;
      return this.http.get<QueryResultsModel>(url, {
        headers: httpHeaders,
        params: httpParams
      });
    }
  
    
  
  }

  // UPDATE => PUT: update the AssignStudentFeemaster on the server
  updateAssignStudentFeemaster(assignStudentFeemaster: AssignFeemasterStudentRequestDtoModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeemaster+'/'+assignStudentFeemaster.feeGroupId, assignStudentFeemaster, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForAssignStudentFeemaster(assignStudentFeemasters: AssignFeemasterStudentRequestDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      assignStudentFeemastersForUpdate: assignStudentFeemasters,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeemaster+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the AssignStudentFeemaster from the server
  deleteAssignStudentFeemaster(assignStudentFeemasterId: number): Observable<AssignFeemasterStudentRequestDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeemaster}/${assignStudentFeemasterId}`;
    return this.http.delete<AssignFeemasterStudentRequestDtoModel>(url, {headers: httpHeaders});
  }

  deleteAssignStudentFeemasters(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeemaster + '/deleteAssignStudentFeemasters';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {assignStudentFeemasterIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


