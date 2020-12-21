import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { VisitorBookModel } from '../_models/visitor-book.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VisitorBookService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new visitorBook to the server
  createVisitorBook(visitorBook: VisitorBookModel): Observable<VisitorBookModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<VisitorBookModel>(Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Book, visitorBook, {headers: httpHeaders});
  }

  // READ
  getAllVisitorBooks(): Observable<VisitorBookModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<VisitorBookModel[]>(Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Book, {headers: httpHeaders});
  }

  getVisitorBookById(visitorBookId: number): Observable<VisitorBookModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<VisitorBookModel>(Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Book+ `/${visitorBookId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findVisitorBooks(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    console.log("api call")
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Book ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the visitorBook on the server
  updateVisitorBook(visitorBook: VisitorBookModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Book+'/'+visitorBook.id, visitorBook, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForVisitorBook(visitorBooks: VisitorBookModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      visitorBooksForUpdate: visitorBooks,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Book+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the visitorBook from the server
  deleteVisitorBook(visitorBookId: number): Observable<VisitorBookModel> {
    debugger
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Book}/${visitorBookId}`;
    return this.http.delete<VisitorBookModel>(url, {headers: httpHeaders});

  }

  deleteVisitorBooks(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Front_Office.Visitor_Book + '/deleteVisitorBooks';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {visitorBookIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


