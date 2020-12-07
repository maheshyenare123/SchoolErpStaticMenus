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
import {AssignVehicleService} from '../_services/assign-vehicle.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  AssignVehicleActionToggleLoading,
  AssignVehicleActionTypes,
  AssignVehicleCreated,
  AssignVehicleOnServerCreated,
  AssignVehiclesPageLoaded,
  AssignVehiclesPageRequested,
  AssignVehiclesPageToggleLoading,
  AssignVehiclesStatusUpdated,
  AssignVehicleUpdated,
  ManyAssignVehiclesDeleted,
  OneAssignVehicleDeleted
} from '../_actions/assign-vehicle.actions';

@Injectable()
export class AssignVehicleEffects {
  showPageLoadingDistpatcher = new AssignVehiclesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new AssignVehicleActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new AssignVehicleActionToggleLoading({isLoading: false});

  @Effect()
  loadAssignVehiclesPage$ = this.actions$.pipe(
    ofType<AssignVehiclesPageRequested>(AssignVehicleActionTypes.AssignVehiclesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.assignvehiclesService.findAssignVehicles(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new AssignVehiclesPageLoaded({
        assignVehicles: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteAssignVehicle$ = this.actions$
    .pipe(
      ofType<OneAssignVehicleDeleted>(AssignVehicleActionTypes.OneAssignVehicleDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.assignvehiclesService.deleteAssignVehicle(payload.payloadItem);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteAssignVehicles$ = this.actions$
    .pipe(
      ofType<ManyAssignVehiclesDeleted>(AssignVehicleActionTypes.ManyAssignVehiclesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.assignvehiclesService.deleteAssignVehicles(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateAssignVehicle$ = this.actions$
    .pipe(
      ofType<AssignVehicleUpdated>(AssignVehicleActionTypes.AssignVehicleUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignvehiclesService.updateAssignVehicle(payload.assignVehicle);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateAssignVehiclesStatus$ = this.actions$
    .pipe(
      ofType<AssignVehiclesStatusUpdated>(AssignVehicleActionTypes.AssignVehiclesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignvehiclesService.updateStatusForAssignVehicle(payload.assignVehicles, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createAssignVehicle$ = this.actions$
    .pipe(
      ofType<AssignVehicleOnServerCreated>(AssignVehicleActionTypes.AssignVehicleOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignvehiclesService.createAssignVehicle(payload.assignVehicle).pipe(
          tap(res => {
            this.store.dispatch(new AssignVehicleCreated({assignVehicle: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private assignvehiclesService: AssignVehicleService, private store: Store<AppState>) {
  }
}
