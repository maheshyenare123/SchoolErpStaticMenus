import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { BookModel } from '../_models/book.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Book to the server
  createBook(book: BookModel): Observable<BookModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<BookModel>(Constants.URL.HOST_URL+Constants.Library.Book, book, {headers: httpHeaders});
  }

  // READ
  getAllBooks(): Observable<BookModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<BookModel[]>(Constants.URL.HOST_URL+Constants.Library.Book, {headers: httpHeaders});
  }
  // READ
  getAllClasses(): Observable<BookModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<BookModel[]>(Constants.URL.HOST_URL+'class', {headers: httpHeaders});
  }

  getBookById(bookId: number): Observable<BookModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<BookModel>(Constants.URL.HOST_URL+Constants.Library.Book+ `/${bookId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findBooks(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Library.Book ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      // params: httpParams
    });
  }

  // UPDATE => PUT: update the Book on the server
  updateBook(book: BookModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Library.Book+'/'+book.id, book, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForBook(books: BookModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      booksForUpdate: books,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Library.Book+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Book from the server
  deleteBook(bookId: number): Observable<BookModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Library.Book}/${bookId}`;
    return this.http.delete<BookModel>(url, {headers: httpHeaders});
  }

  deleteBooks(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Library.Book + '/deleteBooks';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {bookIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


