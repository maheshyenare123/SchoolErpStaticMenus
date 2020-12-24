import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { StudentFeeAmountDetailsModel } from '../_models/student-fee-amount-details.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentFeeAmountDetailsService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new StudentFeeAmountDetails to the server
  createStudentFeeAmountDetails(studentFeeAmountDetails: StudentFeeAmountDetailsModel): Observable<StudentFeeAmountDetailsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<StudentFeeAmountDetailsModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite, studentFeeAmountDetails, {headers: httpHeaders});
  }

  // READ
  getAllStudentFeeAmountDetailss(): Observable<StudentFeeAmountDetailsModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentFeeAmountDetailsModel[]>(Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite, {headers: httpHeaders});
  }

  getStudentFeeAmountDetailsById(feeMastersId: number): Observable<StudentFeeAmountDetailsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentFeeAmountDetailsModel>(Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite+ `/${feeMastersId}`, {headers: httpHeaders});
  }

  getStudentDiscountById(studentFeeAmountDetailsId: number): Observable<StudentFeeAmountDetailsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<StudentFeeAmountDetailsModel>(Constants.URL.HOST_URL+Constants.Fees_Collection. Student_Discount+ `/${studentFeeAmountDetailsId}`, {headers: httpHeaders});
  }

 

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findStudentFeeAmountDetailss(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the StudentFeeAmountDetails on the server
  updateStudentFeeAmountDetails(studentFeeAmountDetails: StudentFeeAmountDetailsModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite+'/'+studentFeeAmountDetails.feeMastersId, studentFeeAmountDetails, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForStudentFeeAmountDetails(studentFeeAmountDetailss: StudentFeeAmountDetailsModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      studentFeeAmountDetailssForUpdate: studentFeeAmountDetailss,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the StudentFeeAmountDetails from the server
  deleteStudentFeeAmountDetails(studentFeeAmountDetailsId: number): Observable<StudentFeeAmountDetailsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite}/${studentFeeAmountDetailsId}`;
    return this.http.delete<StudentFeeAmountDetailsModel>(url, {headers: httpHeaders});
  }

  deleteStudentFeeAmountDetailss(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Fees_Collection.Student_Fee_Deposite + '/deleteStudentFeeAmountDetailss';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {studentFeeAmountDetailsIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


