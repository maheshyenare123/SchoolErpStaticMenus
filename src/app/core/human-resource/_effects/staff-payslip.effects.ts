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
import {StaffPayslipService} from '../_services/staff-payslip.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  StaffPayslipActionToggleLoading,
  StaffPayslipActionTypes,
  StaffPayslipCreated,
  StaffPayslipOnServerCreated,
  StaffPayslipsPageLoaded,
  StaffPayslipsPageRequested,
  StaffPayslipsPageToggleLoading,
  StaffPayslipsStatusUpdated,
  StaffPayslipUpdated,
  ManyStaffPayslipsDeleted,
  OneStaffPayslipDeleted
} from '../_actions/staff-payslip.actions';

@Injectable()
export class StaffPayslipEffects {
  showPageLoadingDistpatcher = new StaffPayslipsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new StaffPayslipActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new StaffPayslipActionToggleLoading({isLoading: false});

  @Effect()
  loadStaffPayslipsPage$ = this.actions$.pipe(
    ofType<StaffPayslipsPageRequested>(StaffPayslipActionTypes.StaffPayslipsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.staffPayslipsService.findStaffPayslips(payload.page,payload.roleName,payload.month,payload.year);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StaffPayslipsPageLoaded({
        staffPayslips: data.content,
    totalCount: data.totalElements,
        page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteStaffPayslip$ = this.actions$
    .pipe(
      ofType<OneStaffPayslipDeleted>(StaffPayslipActionTypes.OneStaffPayslipDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.staffPayslipsService.deleteStaffPayslip(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteStaffPayslips$ = this.actions$
    .pipe(
      ofType<ManyStaffPayslipsDeleted>(StaffPayslipActionTypes.ManyStaffPayslipsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.staffPayslipsService.deleteStaffPayslips(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateStaffPayslip$ = this.actions$
    .pipe(
      ofType<StaffPayslipUpdated>(StaffPayslipActionTypes.StaffPayslipUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffPayslipsService.updateStaffPayslip(payload.staffPayslip);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateStaffPayslipsStatus$ = this.actions$
    .pipe(
      ofType<StaffPayslipsStatusUpdated>(StaffPayslipActionTypes.StaffPayslipsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffPayslipsService.updateStatusForStaffPayslip(payload.staffPayslips, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createStaffPayslip$ = this.actions$
    .pipe(
      ofType<StaffPayslipOnServerCreated>(StaffPayslipActionTypes.StaffPayslipOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffPayslipsService.createStaffPayslip(payload.staffPayslip).pipe(
          tap(res => {
            this.store.dispatch(new StaffPayslipCreated({staffPayslip: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private staffPayslipsService: StaffPayslipService, private store: Store<AppState>) {
  }
}
