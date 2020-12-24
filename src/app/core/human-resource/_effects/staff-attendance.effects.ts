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
import {StaffAttendanceService} from '../_services/staff-attendance.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  StaffAttendanceActionToggleLoading,
  StaffAttendanceActionTypes,
  StaffAttendanceCreated,
  StaffAttendanceOnServerCreated,
  StaffAttendancesPageLoaded,
  StaffAttendancesPageRequested,
  StaffAttendancesPageToggleLoading,
  StaffAttendancesStatusUpdated,
  StaffAttendanceUpdated,
  ManyStaffAttendancesDeleted,
  OneStaffAttendanceDeleted
} from '../_actions/staff-attendance.actions';

@Injectable()
export class StaffAttendanceEffects {
  showPageLoadingDistpatcher = new StaffAttendancesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new StaffAttendanceActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new StaffAttendanceActionToggleLoading({isLoading: false});

  @Effect()
  loadStaffAttendancesPage$ = this.actions$.pipe(
    ofType<StaffAttendancesPageRequested>(StaffAttendanceActionTypes.StaffAttendancesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.staffAttendancesService.findStaffAttendances(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StaffAttendancesPageLoaded({
        staffAttendances: data.content,
    totalCount: data.totalElements,
        page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteStaffAttendance$ = this.actions$
    .pipe(
      ofType<OneStaffAttendanceDeleted>(StaffAttendanceActionTypes.OneStaffAttendanceDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.staffAttendancesService.deleteStaffAttendance(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteStaffAttendances$ = this.actions$
    .pipe(
      ofType<ManyStaffAttendancesDeleted>(StaffAttendanceActionTypes.ManyStaffAttendancesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.staffAttendancesService.deleteStaffAttendances(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateStaffAttendance$ = this.actions$
    .pipe(
      ofType<StaffAttendanceUpdated>(StaffAttendanceActionTypes.StaffAttendanceUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffAttendancesService.updateStaffAttendance(payload.staffAttendance);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateStaffAttendancesStatus$ = this.actions$
    .pipe(
      ofType<StaffAttendancesStatusUpdated>(StaffAttendanceActionTypes.StaffAttendancesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffAttendancesService.updateStatusForStaffAttendance(payload.staffAttendances, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createStaffAttendance$ = this.actions$
    .pipe(
      ofType<StaffAttendanceOnServerCreated>(StaffAttendanceActionTypes.StaffAttendanceOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffAttendancesService.createStaffAttendance(payload.staffAttendance).pipe(
          tap(res => {
            this.store.dispatch(new StaffAttendanceCreated({staffAttendance: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private staffAttendancesService: StaffAttendanceService, private store: Store<AppState>) {
  }
}
