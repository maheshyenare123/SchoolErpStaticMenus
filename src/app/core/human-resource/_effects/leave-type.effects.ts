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
import {LeaveTypeService} from '../_services/leave-type.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  LeaveTypeActionToggleLoading,
  LeaveTypeActionTypes,
  LeaveTypeCreated,
  LeaveTypeOnServerCreated,
  LeaveTypesPageLoaded,
  LeaveTypesPageRequested,
  LeaveTypesPageToggleLoading,
  LeaveTypesStatusUpdated,
  LeaveTypeUpdated,
  ManyLeaveTypesDeleted,
  OneLeaveTypeDeleted
} from '../_actions/leave-type.actions';

@Injectable()
export class LeaveTypeEffects {
  showPageLoadingDistpatcher = new LeaveTypesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new LeaveTypeActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new LeaveTypeActionToggleLoading({isLoading: false});

  @Effect()
  loadLeaveTypesPage$ = this.actions$.pipe(
    ofType<LeaveTypesPageRequested>(LeaveTypeActionTypes.LeaveTypesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.leaveTypesService.findLeaveTypes(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new LeaveTypesPageLoaded({
        leaveTypes: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteLeaveType$ = this.actions$
    .pipe(
      ofType<OneLeaveTypeDeleted>(LeaveTypeActionTypes.OneLeaveTypeDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.leaveTypesService.deleteLeaveType(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteLeaveTypes$ = this.actions$
    .pipe(
      ofType<ManyLeaveTypesDeleted>(LeaveTypeActionTypes.ManyLeaveTypesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.leaveTypesService.deleteLeaveTypes(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateLeaveType$ = this.actions$
    .pipe(
      ofType<LeaveTypeUpdated>(LeaveTypeActionTypes.LeaveTypeUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.leaveTypesService.updateLeaveType(payload.leaveType);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateLeaveTypesStatus$ = this.actions$
    .pipe(
      ofType<LeaveTypesStatusUpdated>(LeaveTypeActionTypes.LeaveTypesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.leaveTypesService.updateStatusForLeaveType(payload.leaveTypes, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createLeaveType$ = this.actions$
    .pipe(
      ofType<LeaveTypeOnServerCreated>(LeaveTypeActionTypes.LeaveTypeOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.leaveTypesService.createLeaveType(payload.leaveType).pipe(
          tap(res => {
            this.store.dispatch(new LeaveTypeCreated({leaveType: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private leaveTypesService: LeaveTypeService, private store: Store<AppState>) {
  }
}
