import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StudentAttendenceDtoModel } from '../_models/studentAttendenceDto.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentAttendenceService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new StudentAttendence to the server
  createStudentAttendence(studentAttendence: StudentAttendenceDtoModel): Observable<StudentAttendenceDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StudentAttendenceDtoModel>(Constants.URL.HOST_URL+Constants.Attendance.Student_Attendance,studentAttendence, {headers: httpHeaders});
  }
// CREATE =>  POST: add a new StudentAttendence to the server
createStudentAttendences(studentAttendence: StudentAttendenceDtoModel[]): Observable<StudentAttendenceDtoModel> {
  // Note: Add headers if needed (tokens/bearer)
  const httpHeaders = this.httpUtils.getHTTPHeaders();
  return this.http.post<StudentAttendenceDtoModel>(Constants.URL.HOST_URL+Constants.Attendance.Student_Attendance,studentAttendence, {headers: httpHeaders});
}
  // READ
  getAllStudentAttendences(): Observable<StudentAttendenceDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentAttendenceDtoModel[]>(Constants.URL.HOST_URL+Constants.Attendance.Student_Attendance, {headers: httpHeaders});
  }

  getStudentAttendenceById(studentAttendenceId: number): Observable<StudentAttendenceDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentAttendenceDtoModel>(Constants.URL.HOST_URL+Constants.Attendance.Student_Attendance+ `/${studentAttendenceId}`, {headers: httpHeaders});
  }
getAllStudentAddendaence(classId:number,sectionId:number,date:string){
  // http://yamistha.cloudjiffy.net/api/student-attendance?classesId=1&date=2020-11-19&pageNo=0&pageSize=10&sectionId=1&sortBy=id
  const httpHeaders = this.httpUtils.getHTTPHeaders();
  // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

  const httpParams =new HttpParams()
  .set('classesId', classId.toString())
  .set('date', date)
  .set('pageNo', '0')
  .set('pageSize', '10')
  .set('sectionId', sectionId.toString())
  .set('sortBy', 'id');
  
  const url =Constants.URL.HOST_URL+Constants.Attendance.Student_Attendance ;
  return this.http.get<QueryResultsModel>(url, {
    headers: httpHeaders,
    params: httpParams
  });

}
  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findStudentAttendences(queryParams: QueryParamsModel,classId:number,sectionId:number,date:string): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
  
    const httpParams =new HttpParams()
    .set('classesId', classId.toString())
    .set('date', date)
    .set('pageNo', queryParams.pageNumber.toString())
    .set('pageSize', queryParams.pageSize.toString())
    .set('sectionId', sectionId.toString())
    .set('sortBy', 'id');
    
    const url =Constants.URL.HOST_URL+Constants.Attendance.Student_Attendance ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the StudentAttendence on the server
  updateStudentAttendence(studentAttendence: StudentAttendenceDtoModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Attendance.Student_Attendance+'/'+studentAttendence.id, studentAttendence, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForStudentAttendence(studentAttendences: StudentAttendenceDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      studentAttendencesForUpdate: studentAttendences,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Attendance.Student_Attendance+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the StudentAttendence from the server
  deleteStudentAttendence(studentAttendenceId: number): Observable<StudentAttendenceDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Attendance.Student_Attendance}/${studentAttendenceId}`;
    return this.http.delete<StudentAttendenceDtoModel>(url, {headers: httpHeaders});
  }

  deleteStudentAttendences(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Attendance.Student_Attendance + '/deleteStudentAttendences';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {studentAttendenceIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


