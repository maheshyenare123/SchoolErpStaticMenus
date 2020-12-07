import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { Observable } from 'rxjs';
import { AssignFeediscountStudentRequestDtoModel } from '../_models/assign-feediscount-student-request-dto.model'


@Injectable({
  providedIn: 'root'
})
export class AssignStudentFeediscountService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new AssignStudentFeediscount to the server
  createAssignStudentFeediscount(assignStudentFeediscount: AssignFeediscountStudentRequestDtoModel): Observable<AssignFeediscountStudentRequestDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<AssignFeediscountStudentRequestDtoModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeediscount, assignStudentFeediscount, {headers: httpHeaders});
  }

  // READ
  getAllAssignStudentFeediscounts(): Observable<AssignFeediscountStudentRequestDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<AssignFeediscountStudentRequestDtoModel[]>(Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeediscount, {headers: httpHeaders});
  }

  getAssignStudentFeediscountById(assignStudentFeediscountId: number): Observable<AssignFeediscountStudentRequestDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<AssignFeediscountStudentRequestDtoModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeediscount+ `/${assignStudentFeediscountId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findAssignStudentFeediscounts(queryParams,classId:number,sectionId:number,category:number,gender:string,rte:string,feeGroupId:number): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
   // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
//
debugger
if(gender == null && rte == null){
  const httpParams =new HttpParams()
  
  .set('categoryId', category.toString())
  .set('classesId', classId.toString())
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


    if(gender == null){
      const httpParams =new HttpParams()
      .set('classesId', classId.toString())
      .set('categoryId', category.toString())
      .set('rte', rte.toString())
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
		if(rte == null){
      const httpParams =new HttpParams()
      .set('classesId', classId.toString())
      .set('gender', gender.toString())
      .set('categoryId', category.toString())
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
  
    
  
  }

  // UPDATE => PUT: update the AssignStudentFeediscount on the server
  updateAssignStudentFeediscount(assignStudentFeediscount: AssignFeediscountStudentRequestDtoModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeediscount+'/'+assignStudentFeediscount.feeDiscountId, assignStudentFeediscount, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForAssignStudentFeediscount(assignStudentFeediscounts: AssignFeediscountStudentRequestDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      assignStudentFeediscountsForUpdate: assignStudentFeediscounts,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeediscount+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the AssignStudentFeediscount from the server
  deleteAssignStudentFeediscount(assignStudentFeediscountId: number): Observable<AssignFeediscountStudentRequestDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeediscount}/${assignStudentFeediscountId}`;
    return this.http.delete<AssignFeediscountStudentRequestDtoModel>(url, {headers: httpHeaders});
  }

  deleteAssignStudentFeediscounts(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.AssignStudentFeediscount + '/deleteAssignStudentFeediscounts';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {assignStudentFeediscountIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


