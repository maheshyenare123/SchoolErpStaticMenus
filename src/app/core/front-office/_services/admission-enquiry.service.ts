import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { EnquiryModel } from '../_models/enquiry.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdmissionEnquiryService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new admissionEnquiry to the server
  createAdmissionEnquiry(admissionEnquiry: EnquiryModel): Observable<EnquiryModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<EnquiryModel>(Constants.URL.HOST_URL+Constants.Front_Office.Admission_Enquiry, admissionEnquiry, {headers: httpHeaders});
  }

  // READ
  getAllAdmissionEnquirys(): Observable<EnquiryModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<EnquiryModel[]>(Constants.URL.HOST_URL+Constants.Front_Office.Admission_Enquiry, {headers: httpHeaders});
  }
  // READ
  getAllClasses(): Observable<EnquiryModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<EnquiryModel[]>(Constants.URL.HOST_URL+'class', {headers: httpHeaders});
  }

  getAdmissionEnquiryById(admissionEnquiryId: number): Observable<EnquiryModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<EnquiryModel>(Constants.URL.HOST_URL+Constants.Front_Office.Admission_Enquiry+ `/${admissionEnquiryId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findAdmissionEnquirys(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParams(queryParams);


    const httpParams =new HttpParams()
    .set('fromDate', "2020-01-01")
    .set('pageNo', queryParams.pageNumber.toString())
    .set('pageSize', queryParams.pageSize.toString())
    .set('sortBy', 'id')
    .set('toDate', "2020-12-31");

    const url =Constants.URL.HOST_URL+Constants.Front_Office.Admission_Enquiry ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the admissionEnquiry on the server
  updateAdmissionEnquiry(admissionEnquiry: EnquiryModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Front_Office.Admission_Enquiry+'/'+admissionEnquiry.id, admissionEnquiry, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForAdmissionEnquiry(admissionEnquirys: EnquiryModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      admissionEnquirysForUpdate: admissionEnquirys,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Admission_Enquiry+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the admissionEnquiry from the server
  deleteAdmissionEnquiry(admissionEnquiryId: number): Observable<EnquiryModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Front_Office.Admission_Enquiry}/${admissionEnquiryId}`;
    return this.http.delete<EnquiryModel>(url, {headers: httpHeaders});
  }

  deleteAdmissionEnquirys(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Admission_Enquiry + '/deleteAdmissionEnquirys';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {admissionEnquiryIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


