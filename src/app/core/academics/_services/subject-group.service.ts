import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { SubjectGroupDtoModel } from '../_models/subjectGroupDto.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SubjectGroupService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new SubjectGroup to the server
  createSubjectGroup(subjectGroup: SubjectGroupDtoModel): Observable<SubjectGroupDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<SubjectGroupDtoModel>(Constants.URL.HOST_URL+Constants.Academics.Subject_Group, subjectGroup, {headers: httpHeaders});
  }

  // READ
  getAllSubjectGroups(): Observable<SubjectGroupDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SubjectGroupDtoModel[]>(Constants.URL.HOST_URL+Constants.Academics.Subject_Group, {headers: httpHeaders});
  }

  getSubjectGroupById(subjectGroupId: number): Observable<SubjectGroupDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SubjectGroupDtoModel>(Constants.URL.HOST_URL+Constants.Academics.Subject_Group+ `/${subjectGroupId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findSubjectGroups(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Academics.Subject_Group ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the SubjectGroup on the server
  updateSubjectGroup(subjectGroup: SubjectGroupDtoModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Academics.Subject_Group+'/'+subjectGroup.id, subjectGroup, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForSubjectGroup(subjectGroups: SubjectGroupDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      subjectGroupsForUpdate: subjectGroups,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Academics.Subject_Group+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the SubjectGroup from the server
  deleteSubjectGroup(subjectGroupId: number): Observable<SubjectGroupDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Academics.Subject_Group}/${subjectGroupId}`;
    return this.http.delete<SubjectGroupDtoModel>(url, {headers: httpHeaders});
  }

  deleteSubjectGroups(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Academics.Subject_Group + '/deleteSubjectGroups';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {subjectGroupIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


