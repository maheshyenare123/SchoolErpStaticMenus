import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { NoticeBoardModel } from '../_models/notice-board.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoticeBoardService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new NoticeBoard to the server
  createNoticeBoard(noticeBoard: NoticeBoardModel): Observable<NoticeBoardModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<NoticeBoardModel>(Constants.URL.HOST_URL+Constants.Hostels.NoticeBoard, noticeBoard, {headers: httpHeaders});
  }

  // READ
  getAllNoticeBoards(): Observable<NoticeBoardModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<NoticeBoardModel[]>(Constants.URL.HOST_URL+Constants.Hostels.NoticeBoard, {headers: httpHeaders});
  }

  getNoticeBoardById(noticeBoardId: number): Observable<NoticeBoardModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<NoticeBoardModel>(Constants.URL.HOST_URL+Constants.Hostels.NoticeBoard+ `/${noticeBoardId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findNoticeBoards(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Hostels.NoticeBoard ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the NoticeBoard on the server
  updateNoticeBoard(noticeBoard: NoticeBoardModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Hostels.NoticeBoard+'/'+noticeBoard.id, noticeBoard, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForNoticeBoard(noticeBoards: NoticeBoardModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      noticeBoardsForUpdate: noticeBoards,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Hostels.NoticeBoard+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the NoticeBoard from the server
  deleteNoticeBoard(noticeBoardId: number): Observable<NoticeBoardModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Hostels.NoticeBoard}/${noticeBoardId}`;
    return this.http.delete<NoticeBoardModel>(url, {headers: httpHeaders});
  }

  deleteNoticeBoards(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Hostels.NoticeBoard + '/deleteNoticeBoards';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {noticeBoardIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


