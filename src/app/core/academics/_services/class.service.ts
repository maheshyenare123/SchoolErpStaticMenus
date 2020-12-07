import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ClassDtoModel } from '../_models/classDto.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Class to the server
  createClass(classs: ClassDtoModel): Observable<ClassDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<ClassDtoModel>(Constants.URL.HOST_URL+Constants.Academics.Class, classs, {headers: httpHeaders});
  }

  // READ
  getAllClasss(): Observable<ClassDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ClassDtoModel[]>(Constants.URL.HOST_URL+Constants.Academics.Class, {headers: httpHeaders});
  }
 

  getClassById(classId: number): Observable<ClassDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<ClassDtoModel>(Constants.URL.HOST_URL+Constants.Academics.Class+ `/${classId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findClasss(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Academics.Class ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the Class on the server
  updateClass(classs: ClassDtoModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Academics.Class+'/'+classs.id, classs, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForClass(classs: ClassDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      classsForUpdate: classs,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Academics.Class+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Class from the server
  deleteClass(classId: number): Observable<ClassDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Academics.Class}/${classId}`;
    return this.http.delete<ClassDtoModel>(url, {headers: httpHeaders});
  }

  deleteClasss(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Academics.Class + '/deleteClasss';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {classIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


