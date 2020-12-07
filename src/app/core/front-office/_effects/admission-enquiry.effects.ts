import {QueryParamsModel} from './../../_base/crud/models/query-models/query-params.model';
import {forkJoin, of} from 'rxjs';
// Angular
import {Injectable} from '@angular/core';
// RxJS
import {map, mergeMap, tap} from 'rxjs/operators';
// NGRX
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
// CRUD
import {QueryResultsModel, FindResultsModel} from '../../_base/crud';
// Services
import {AdmissionEnquiryService} from '../_services/admission-enquiry.service';
// State
import {AppState} from '../../../core/reducers';
// Actions
import {
  AdmissionEnquiryActionToggleLoading,
  AdmissionEnquiryActionTypes,
  AdmissionEnquiryCreated,
  AdmissionEnquiryOnServerCreated,
  AdmissionEnquirysPageLoaded,
  AdmissionEnquirysPageRequested,
  AdmissionEnquirysPageToggleLoading,
  AdmissionEnquirysStatusUpdated,
  AdmissionEnquiryUpdated,
  ManyAdmissionEnquirysDeleted,
  OneAdmissionEnquiryDeleted
} from '../_actions/admission-enquiry.actions';

@Injectable()
export class AdmissionEnquiryEffects {
  showPageLoadingDistpatcher = new AdmissionEnquirysPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new AdmissionEnquiryActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new AdmissionEnquiryActionToggleLoading({isLoading: false});

  @Effect()
  loadAdmissionEnquirysPage$ = this.actions$.pipe(
    ofType<AdmissionEnquirysPageRequested>(AdmissionEnquiryActionTypes.AdmissionEnquirysPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.admissionEnquirysService.findAdmissionEnquirys(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new AdmissionEnquirysPageLoaded({
        enquirys: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );

  @Effect()
  deleteAdmissionEnquiry$ = this.actions$
    .pipe(
      ofType<OneAdmissionEnquiryDeleted>(AdmissionEnquiryActionTypes.OneAdmissionEnquiryDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.admissionEnquirysService.deleteAdmissionEnquiry(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteAdmissionEnquirys$ = this.actions$
    .pipe(
      ofType<ManyAdmissionEnquirysDeleted>(AdmissionEnquiryActionTypes.ManyAdmissionEnquirysDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.admissionEnquirysService.deleteAdmissionEnquirys(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateAdmissionEnquiry$ = this.actions$
    .pipe(
      ofType<AdmissionEnquiryUpdated>(AdmissionEnquiryActionTypes.AdmissionEnquiryUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.admissionEnquirysService.updateAdmissionEnquiry(payload.enquiry);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateAdmissionEnquirysStatus$ = this.actions$
    .pipe(
      ofType<AdmissionEnquirysStatusUpdated>(AdmissionEnquiryActionTypes.AdmissionEnquirysStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.admissionEnquirysService.updateStatusForAdmissionEnquiry(payload.enquirys, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createAdmissionEnquiry$ = this.actions$
    .pipe(
      ofType<AdmissionEnquiryOnServerCreated>(AdmissionEnquiryActionTypes.AdmissionEnquiryOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.admissionEnquirysService.createAdmissionEnquiry(payload.enquiry).pipe(
          tap(res => {
            this.store.dispatch(new AdmissionEnquiryCreated({enquiry: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private admissionEnquirysService: AdmissionEnquiryService, private store: Store<AppState>) {
  }
}
