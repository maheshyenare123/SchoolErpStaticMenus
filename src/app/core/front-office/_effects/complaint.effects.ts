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
import {ComplaintService} from '../_services/complaint.service';
// State
import {AppState} from '../../../core/reducers';
// Actions
import {
  ComplaintActionToggleLoading,
  ComplaintActionTypes,
  ComplaintCreated,
  ComplaintOnServerCreated,
  ComplaintsPageLoaded,
  ComplaintsPageRequested,
  ComplaintsPageToggleLoading,
  ComplaintsStatusUpdated,
  ComplaintUpdated,
  ManyComplaintsDeleted,
  OneComplaintDeleted
} from '../_actions/complaint.actions';

@Injectable()
export class ComplaintEffects {
  showPageLoadingDistpatcher = new ComplaintsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ComplaintActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ComplaintActionToggleLoading({isLoading: false});

  @Effect()
  loadComplaintsPage$ = this.actions$.pipe(
    ofType<ComplaintsPageRequested>(ComplaintActionTypes.ComplaintsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.complaintsService.findComplaints(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ComplaintsPageLoaded({
        complaints: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteComplaint$ = this.actions$
    .pipe(
      ofType<OneComplaintDeleted>(ComplaintActionTypes.OneComplaintDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.complaintsService.deleteComplaint(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteComplaints$ = this.actions$
    .pipe(
      ofType<ManyComplaintsDeleted>(ComplaintActionTypes.ManyComplaintsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.complaintsService.deleteComplaints(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateComplaint$ = this.actions$
    .pipe(
      ofType<ComplaintUpdated>(ComplaintActionTypes.ComplaintUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.complaintsService.updateComplaint(payload.complaint);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateComplaintsStatus$ = this.actions$
    .pipe(
      ofType<ComplaintsStatusUpdated>(ComplaintActionTypes.ComplaintsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.complaintsService.updateStatusForComplaint(payload.complaints, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createComplaint$ = this.actions$
    .pipe(
      ofType<ComplaintOnServerCreated>(ComplaintActionTypes.ComplaintOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.complaintsService.createComplaint(payload.complaint).pipe(
          tap(res => {
            this.store.dispatch(new ComplaintCreated({complaint: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private complaintsService: ComplaintService, private store: Store<AppState>) {
  }
}
