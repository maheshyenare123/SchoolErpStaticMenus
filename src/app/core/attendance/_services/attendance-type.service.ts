import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { AttendenceTypeModel} from '../_models/attendenceType.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AttendenceTypeService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  
// READ
getAllAttendanceType(): Observable<AttendenceTypeModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<AttendenceTypeModel[]>(Constants.URL.HOST_URL+Constants.Attendance.Attendance_Type, {headers: httpHeaders});
  }

}


