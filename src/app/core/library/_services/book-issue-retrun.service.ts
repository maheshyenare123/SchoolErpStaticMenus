import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { BookIssueReturnModel } from '../_models/book-issue-return.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BookIssueReturnService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new BookIssueReturn to the server
  createBookIssueReturn(bookIssueReturn: BookIssueReturnModel): Observable<BookIssueReturnModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<BookIssueReturnModel>(Constants.URL.HOST_URL+Constants.Library.Book_Issue_Return+"/book", bookIssueReturn, {headers: httpHeaders});
  }

  updateBookIssueReturn(bookIssueReturn: BookIssueReturnModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post(Constants.URL.HOST_URL+Constants.Library.Book_Issue_Return+'/book/return', bookIssueReturn, {headers: httpHeader});
  }
  // READ
  getAllBookIssueReturns(): Observable<BookIssueReturnModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<BookIssueReturnModel[]>(Constants.URL.HOST_URL+Constants.Library.Book_Issue_Return, {headers: httpHeaders});
  }


  getBookIssueReturnById(bookIssueReturnId: number): Observable<BookIssueReturnModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<BookIssueReturnModel>(Constants.URL.HOST_URL+Constants.Library.Book_Issue_Return+ `/${bookIssueReturnId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findBookIssueReturns(queryParams: QueryParamsModel,id): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Library.Book_Issue_Return+"/"+id ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the BookIssueReturn on the server
  // updateBookIssueReturn(bookIssueReturn: BookIssueReturnModel): Observable<any> {
  //   const httpHeader = this.httpUtils.getHTTPHeaders();
  //   return this.http.put(Constants.URL.HOST_URL+Constants.Library.Book_Issue_Return+'/'+bookIssueReturn.memberId, bookIssueReturn, {headers: httpHeader});
  // }

  // UPDATE Status
  updateStatusForBookIssueReturn(bookIssueReturns: BookIssueReturnModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      bookIssueReturnsForUpdate: bookIssueReturns,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Library.Book_Issue_Return+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the BookIssueReturn from the server
  deleteBookIssueReturn(bookIssueReturnId: number): Observable<BookIssueReturnModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Library.Book_Issue_Return}/${bookIssueReturnId}`;
    return this.http.delete<BookIssueReturnModel>(url, {headers: httpHeaders});
  }

  deleteBookIssueReturns(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Library.Book_Issue_Return + '/deleteBookIssueReturns';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {bookIssueReturnIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


