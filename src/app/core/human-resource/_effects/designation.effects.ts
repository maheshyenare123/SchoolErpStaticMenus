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
import {StaffDesignationService} from '../_services/designation.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  StaffDesignationActionToggleLoading,
  StaffDesignationActionTypes,
  StaffDesignationCreated,
  StaffDesignationOnServerCreated,
  StaffDesignationsPageLoaded,
  StaffDesignationsPageRequested,
  StaffDesignationsPageToggleLoading,
  StaffDesignationsStatusUpdated,
  StaffDesignationUpdated,
  ManyStaffDesignationsDeleted,
  OneStaffDesignationDeleted
} from '../_actions/designation.actions';

@Injectable()
export class StaffDesignationEffects {
  showPageLoadingDistpatcher = new StaffDesignationsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new StaffDesignationActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new StaffDesignationActionToggleLoading({isLoading: false});

  @Effect()
  loadStaffDesignationsPage$ = this.actions$.pipe(
    ofType<StaffDesignationsPageRequested>(StaffDesignationActionTypes.StaffDesignationsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.staffDesignationsService.findStaffDesignations(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StaffDesignationsPageLoaded({
        staffDesignations: data.content,
    totalCount: data.totalElements,
        page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteStaffDesignation$ = this.actions$
    .pipe(
      ofType<OneStaffDesignationDeleted>(StaffDesignationActionTypes.OneStaffDesignationDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.staffDesignationsService.deleteStaffDesignation(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteStaffDesignations$ = this.actions$
    .pipe(
      ofType<ManyStaffDesignationsDeleted>(StaffDesignationActionTypes.ManyStaffDesignationsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.staffDesignationsService.deleteStaffDesignations(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateStaffDesignation$ = this.actions$
    .pipe(
      ofType<StaffDesignationUpdated>(StaffDesignationActionTypes.StaffDesignationUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffDesignationsService.updateStaffDesignation(payload.staffDesignation);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateStaffDesignationsStatus$ = this.actions$
    .pipe(
      ofType<StaffDesignationsStatusUpdated>(StaffDesignationActionTypes.StaffDesignationsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffDesignationsService.updateStatusForStaffDesignation(payload.staffDesignations, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createStaffDesignation$ = this.actions$
    .pipe(
      ofType<StaffDesignationOnServerCreated>(StaffDesignationActionTypes.StaffDesignationOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffDesignationsService.createStaffDesignation(payload.staffDesignation).pipe(
          tap(res => {
            this.store.dispatch(new StaffDesignationCreated({staffDesignation: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private staffDesignationsService: StaffDesignationService, private store: Store<AppState>) {
  }
}
