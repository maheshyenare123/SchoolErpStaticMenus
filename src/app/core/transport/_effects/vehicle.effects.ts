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
import {VehicleService} from '../_services/vehicle.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  VehicleActionToggleLoading,
  VehicleActionTypes,
  VehicleCreated,
  VehicleOnServerCreated,
  VehiclesPageLoaded,
  VehiclesPageRequested,
  VehiclesPageToggleLoading,
  VehiclesStatusUpdated,
  VehicleUpdated,
  ManyVehiclesDeleted,
  OneVehicleDeleted
} from '../_actions/vehicle.actions';

@Injectable()
export class VehicleEffects {
  showPageLoadingDistpatcher = new VehiclesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new VehicleActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new VehicleActionToggleLoading({isLoading: false});

  @Effect()
  loadVehiclesPage$ = this.actions$.pipe(
    ofType<VehiclesPageRequested>(VehicleActionTypes.VehiclesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.vehiclesService.findVehicles(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new VehiclesPageLoaded({
        vehicles: data.content,
totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteVehicle$ = this.actions$
    .pipe(
      ofType<OneVehicleDeleted>(VehicleActionTypes.OneVehicleDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.vehiclesService.deleteVehicle(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteVehicles$ = this.actions$
    .pipe(
      ofType<ManyVehiclesDeleted>(VehicleActionTypes.ManyVehiclesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.vehiclesService.deleteVehicles(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateVehicle$ = this.actions$
    .pipe(
      ofType<VehicleUpdated>(VehicleActionTypes.VehicleUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.vehiclesService.updateVehicle(payload.vehicle);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateVehiclesStatus$ = this.actions$
    .pipe(
      ofType<VehiclesStatusUpdated>(VehicleActionTypes.VehiclesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.vehiclesService.updateStatusForVehicle(payload.vehicles, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createVehicle$ = this.actions$
    .pipe(
      ofType<VehicleOnServerCreated>(VehicleActionTypes.VehicleOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.vehiclesService.createVehicle(payload.vehicle).pipe(
          tap(res => {
            this.store.dispatch(new VehicleCreated({vehicle: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private vehiclesService: VehicleService, private store: Store<AppState>) {
  }
}
