import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Constants } from '../../api_url';
import { HttpUtilsService, QueryResultsModel, QueryParamsModel } from '../../_base/crud';
import { SectionDtoModel } from '../_models/sectionDto.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  // CREATE =>  POST: add a new Section to the server
  createSection(section: SectionDtoModel): Observable<SectionDtoModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<SectionDtoModel>(Constants.URL.HOST_URL+Constants.Academics.Section, section, {headers: httpHeaders});
  }

  // READ
  getAllSections(): Observable<SectionDtoModel[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SectionDtoModel[]>(Constants.URL.HOST_URL+Constants.Academics.Section, {headers: httpHeaders});
  }

  getSectionById(sectionId: number): Observable<SectionDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<SectionDtoModel>(Constants.URL.HOST_URL+Constants.Academics.Section+ `/${sectionId}`, {headers: httpHeaders});
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findSections(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url =Constants.URL.HOST_URL+Constants.Academics.Section ;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
     params: httpParams
    });
  }

  // UPDATE => PUT: update the Section on the server
  updateSection(section: SectionDtoModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(Constants.URL.HOST_URL+Constants.Academics.Section+'/'+section.id, section, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForSection(sections: SectionDtoModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      sectionsForUpdate: sections,
      newStatus: status
    };
    const url = Constants.URL.HOST_URL+Constants.Academics.Section+ '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Section from the server
  deleteSection(sectionId: number): Observable<SectionDtoModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${Constants.URL.HOST_URL+Constants.Academics.Section}/${sectionId}`;
    return this.http.delete<SectionDtoModel>(url, {headers: httpHeaders});
  }

  deleteSections(ids: number[] = []): Observable<any> {
    const url = Constants.URL.HOST_URL+Constants.Academics.Section + '/deleteSections';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {sectionIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }


}


