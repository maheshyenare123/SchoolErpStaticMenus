import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StudentFeeDepositeModel } from '../_models/student-fee-deposite.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentFeeDepositeService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new StudentFeeDeposite to the server
  createStudentFeeDeposite(studentFeeDeposite: StudentFeeDepositeModel): Observable<StudentFeeDepositeModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StudentFeeDepositeModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite, studentFeeDeposite, {headers: httpHeaders});
  }

  // READ
  getAllStudentFeeDeposites(): Observable<StudentFeeDepositeModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentFeeDepositeModel[]>(Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite, {headers: httpHeaders});
  }

  getStudentFeeDepositeById(studentFeeDepositeId: number): Observable<StudentFeeDepositeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentFeeDepositeModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite+ `/${studentFeeDepositeId}`, {headers: httpHeaders});
  }

  getStudentDiscountById(studentFeeDepositeId: number): Observable<StudentFeeDepositeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentFeeDepositeModel>(Constants.URL.HOST_URL+Constants.Fees_Collection. Student_Discount+ `/${studentFeeDepositeId}`, {headers: httpHeaders});
  }

 

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findStudentFeeDeposites(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the StudentFeeDeposite on the server
  updateStudentFeeDeposite(studentFeeDeposite: StudentFeeDepositeModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite+'/'+studentFeeDeposite.feeGroupId, studentFeeDeposite, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForStudentFeeDeposite(studentFeeDeposites: StudentFeeDepositeModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      studentFeeDepositesForUpdate: studentFeeDeposites,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the StudentFeeDeposite from the server
  deleteStudentFeeDeposite(studentFeeDepositeId: number): Observable<StudentFeeDepositeModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite}/${studentFeeDepositeId}`;
    return this.http.delete<StudentFeeDepositeModel>(url, {headers: httpHeaders});
  }

  deleteStudentFeeDeposites(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite + '/deleteStudentFeeDeposites';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {studentFeeDepositeIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


