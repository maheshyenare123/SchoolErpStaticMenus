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
import {ApproveLeaveService} from '../_services/approve-leave.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ApproveLeaveActionToggleLoading,
  ApproveLeaveActionTypes,
  ApproveLeaveCreated,
  ApproveLeaveOnServerCreated,
  ApproveLeavesPageLoaded,
  ApproveLeavesPageRequested,
  ApproveLeavesPageToggleLoading,
  ApproveLeavesStatusUpdated,
  ApproveLeaveUpdated,
  ManyApproveLeavesDeleted,
  OneApproveLeaveDeleted
} from '../_actions/approve-leave.actions';

@Injectable()
export class ApproveLeaveEffects {
  showPageLoadingDistpatcher = new ApproveLeavesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ApproveLeaveActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ApproveLeaveActionToggleLoading({isLoading: false});

  @Effect()
  loadApproveLeavesPage$ = this.actions$.pipe(
    ofType<ApproveLeavesPageRequested>(ApproveLeaveActionTypes.ApproveLeavesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.approveLeavesService.findApproveLeaves(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ApproveLeavesPageLoaded({
        approveLeaves: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
 
  
  @Effect()
  deleteApproveLeave$ = this.actions$
    .pipe(
      ofType<OneApproveLeaveDeleted>(ApproveLeaveActionTypes.OneApproveLeaveDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.approveLeavesService.deleteApproveLeave(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteApproveLeaves$ = this.actions$
    .pipe(
      ofType<ManyApproveLeavesDeleted>(ApproveLeaveActionTypes.ManyApproveLeavesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.approveLeavesService.deleteApproveLeaves(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateApproveLeave$ = this.actions$
    .pipe(
      ofType<ApproveLeaveUpdated>(ApproveLeaveActionTypes.ApproveLeaveUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.approveLeavesService.updateApproveLeave(payload.approveLeave);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateApproveLeavesStatus$ = this.actions$
    .pipe(
      ofType<ApproveLeavesStatusUpdated>(ApproveLeaveActionTypes.ApproveLeavesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.approveLeavesService.updateStatusForApproveLeave(payload.approveLeaves, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createApproveLeave$ = this.actions$
    .pipe(
      ofType<ApproveLeaveOnServerCreated>(ApproveLeaveActionTypes.ApproveLeaveOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.approveLeavesService.createApproveLeave(payload.approveLeave).pipe(
          tap(res => {
            this.store.dispatch(new ApproveLeaveCreated({approveLeave: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private approveLeavesService: ApproveLeaveService, private store: Store<AppState>) {
  }
}
