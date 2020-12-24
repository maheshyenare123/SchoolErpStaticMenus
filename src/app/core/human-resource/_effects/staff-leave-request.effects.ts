import {QueryParamsModel} from '../../_base/crud/models/query-models/query-params.model';
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
import {StaffLeaveRequestService} from '../_services/staff-leave-request.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  StaffLeaveRequestActionToggleLoading,
  StaffLeaveRequestActionTypes,
  StaffLeaveRequestCreated,
  StaffLeaveRequestOnServerCreated,
  StaffLeaveRequestsPageLoaded,
  StaffLeaveRequestsPageRequested,
  StaffLeaveRequestsPageToggleLoading,
  StaffLeaveRequestsStatusUpdated,
  StaffLeaveRequestUpdated,
  ManyStaffLeaveRequestsDeleted,
  OneStaffLeaveRequestDeleted
} from '../_actions/staff-leave-request.actions';

@Injectable()
export class StaffLeaveRequestEffects {
  showPageLoadingDistpatcher = new StaffLeaveRequestsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new StaffLeaveRequestActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new StaffLeaveRequestActionToggleLoading({isLoading: false});

  @Effect()
  loadStaffLeaveRequestsPage$ = this.actions$.pipe(
    ofType<StaffLeaveRequestsPageRequested>(StaffLeaveRequestActionTypes.StaffLeaveRequestsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.staffLeaveRequestsService.findStaffLeaveRequests(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StaffLeaveRequestsPageLoaded({
        staffLeaveRequests: data.content,
    totalCount: data.totalElements,
        page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteStaffLeaveRequest$ = this.actions$
    .pipe(
      ofType<OneStaffLeaveRequestDeleted>(StaffLeaveRequestActionTypes.OneStaffLeaveRequestDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.staffLeaveRequestsService.deleteStaffLeaveRequest(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteStaffLeaveRequests$ = this.actions$
    .pipe(
      ofType<ManyStaffLeaveRequestsDeleted>(StaffLeaveRequestActionTypes.ManyStaffLeaveRequestsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.staffLeaveRequestsService.deleteStaffLeaveRequests(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateStaffLeaveRequest$ = this.actions$
    .pipe(
      ofType<StaffLeaveRequestUpdated>(StaffLeaveRequestActionTypes.StaffLeaveRequestUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffLeaveRequestsService.updateStaffLeaveRequest(payload.staffLeaveRequest);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateStaffLeaveRequestsStatus$ = this.actions$
    .pipe(
      ofType<StaffLeaveRequestsStatusUpdated>(StaffLeaveRequestActionTypes.StaffLeaveRequestsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffLeaveRequestsService.updateStatusForStaffLeaveRequest(payload.staffLeaveRequests, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createStaffLeaveRequest$ = this.actions$
    .pipe(
      ofType<StaffLeaveRequestOnServerCreated>(StaffLeaveRequestActionTypes.StaffLeaveRequestOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffLeaveRequestsService.createStaffLeaveRequest(payload.staffLeaveRequest).pipe(
          tap(res => {
            this.store.dispatch(new StaffLeaveRequestCreated({staffLeaveRequest: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private staffLeaveRequestsService: StaffLeaveRequestService, private store: Store<AppState>) {
  }
}
