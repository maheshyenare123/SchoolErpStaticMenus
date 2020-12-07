
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { ClassTimetableModel } from '../_models/class-timetable.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StaffTimetableService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // READ
  getAllStaffTimetables(staffId): Observable<ClassTimetableModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams =new HttpParams()
    .set('staffId', staffId)
   
    
    return this.http.get<ClassTimetableModel[]>(Constants.URL.HOST_URL+Constants.Academics.Teacher_TimeTable, {headers: httpHeaders,params: httpParams});
  }

// /


 


}


