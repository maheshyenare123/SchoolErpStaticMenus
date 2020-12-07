import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StudentDtoModel } from '../_models/studentDto.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new student to the server
  createStudent(student: StudentDtoModel): Observable<StudentDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StudentDtoModel>(Constants.URL.HOST_URL+Constants.Student_Information.Student, student, {headers: httpHeaders});
  }

  // READ
  getAllStudents(): Observable<StudentDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentDtoModel[]>(Constants.URL.HOST_URL+Constants.Student_Information.Student, {headers: httpHeaders});
  }

  getStudentById(studentId: number): Observable<StudentDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentDtoModel>(Constants.URL.HOST_URL+Constants.Student_Information.Student+ `/${studentId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findStudents(queryParams: QueryParamsModel,classId,sectionId): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    // httpParams.set('isActive', 'active')

    const httpParams =new HttpParams()
      .set('classId', classId)
      .set('isActive', 'yes')
      .set('pageNo', queryParams.pageNumber.toString())
      .set('pageSize', queryParams.pageSize.toString())
      .set('sectionId', sectionId)
      .set('sortBy', 'id');

      // http://yamistha.cloudjiffy.net/api/student?isActive=yes&pageNo=0&pageSize=10&sortBy=id
    const url =Constants.URL.HOST_URL+Constants.Student_Information.Student ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }




  // http://yamistha.cloudjiffy.net/api/student/api/disable-student?classId=1&pageNo=0&pageSize=10&sectionId=1&sortBy=id
// find disable student


findDisableStudents(queryParams: QueryParamsModel,classId:number,sectionId:number): Observable<QueryResultsModel> {
  // Note: Add headers if needed (tokens/bearer)
  const httpHeaders = this.httpUtils.getHTTPHeaders();
  // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
  // httpParams.set('isActive', 'active')

  const httpParams =new HttpParams()
   
    .set('classId', classId.toString())
    .set('pageNo', queryParams.pageNumber.toString())
    .set('pageSize', queryParams.pageSize.toString())
    .set('sectionId', sectionId.toString())
    .set('sortBy', 'id');

  const url =Constants.URL.HOST_URL+Constants.Student_Information.Student+'/api/disable-student';
  
  return this.http.get<QueryResultsModel>(url, {
    headers: httpHeaders,
    params: httpParams
  });
}

findDisableStudentusers(queryParams: QueryParamsModel,role:string): Observable<QueryResultsModel> {
  // Note: Add headers if needed (tokens/bearer)
  const httpHeaders = this.httpUtils.getHTTPHeaders();
  // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
  // httpParams.set('isActive', 'active')

  const httpParams =new HttpParams()
   
    .set('role-name', role.toString())
    .set('pageNo', queryParams.pageNumber.toString())
    .set('pageSize', queryParams.pageSize.toString())
    .set('sortBy', 'id');

  const url =Constants.URL.HOST_URL+Constants.Student_Information.User;
  
  return this.http.get<QueryResultsModel>(url, {
    headers: httpHeaders,
    params: httpParams
  });
}


  // UPDATE => PUT: update the student on the server
  updateStudent(student: StudentDtoModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Student_Information.Student+'/'+student.id, student, {headers: httpHeaders});
  }

  // UPDATE Status
  updateStatusForStudent(students: StudentDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      studentsForUpdate: students,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Student+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the student from the server
  deleteStudent(studentId: number): Observable<StudentDtoModel> { 
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Student_Information.Student}/${studentId}`;
    return this.http.delete<StudentDtoModel>(url, {headers: httpHeaders});
  }

  deleteStudents(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Student_Information.Student + '/bulkdelete';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const options = {
      headers: httpHeaders,
      body: ids
    }

    return this.http.delete<QueryResultsModel>(url,options);
  }


}


