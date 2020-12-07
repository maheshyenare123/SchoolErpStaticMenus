import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StudentDtoModel } from '../_models/studentDto.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DisabledStudentService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new DisabledStudent to the server
  createDisabledStudent(disabledStudent: StudentDtoModel): Observable<StudentDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StudentDtoModel>(Constants.URL.HOST_URL+Constants.Student_Information.Disable_Student, disabledStudent, {headers: httpHeaders});
  }

  // READ
  getAllDisabledStudents(): Observable<StudentDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentDtoModel[]>(Constants.URL.HOST_URL+Constants.Student_Information.Disable_Student, {headers: httpHeaders});
  }

  getDisabledStudentById(disabledStudentId: number): Observable<StudentDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentDtoModel>(Constants.URL.HOST_URL+Constants.Student_Information.Disable_Student+ `/${disabledStudentId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findDisabledStudents(queryParams: QueryParamsModel,classId:number,sectionId:number): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);


    const httpParams =new HttpParams()
    .set('classId', classId.toString())
    .set('pageNo', queryParams.pageNumber.toString())
    .set('pageSize', queryParams.pageSize.toString())
    .set('sectionId', sectionId.toString())
    .set('sortBy', 'id');

    const url =Constants.URL.HOST_URL+Constants.Student_Information.Disable_Student;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the DisabledStudent on the server
  updateDisabledStudent(disabledStudent: StudentDtoModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Student_Information.Disable_Student+'/'+disabledStudent.id, disabledStudent, {headers: httpHeaders});
  }

  // UPDATE Status
  updateStatusForDisabledStudent(disabledStudents: StudentDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      disabledStudentsForUpdate: disabledStudents,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Disable_Student+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the DisabledStudent from the server
  deleteDisabledStudent(disabledStudentId: number): Observable<StudentDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Student_Information.Disable_Student}/${disabledStudentId}`;
    return this.http.delete<StudentDtoModel>(url, {headers: httpHeaders});
  }

  deleteDisabledStudents(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Disable_Student + '/deleteDisabledStudents';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {disabledStudentIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


