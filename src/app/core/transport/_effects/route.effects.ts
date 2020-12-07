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
import {RouteService} from '../_services/route.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  RouteActionToggleLoading,
  RouteActionTypes,
  RouteCreated,
  RouteOnServerCreated,
  RoutesPageLoaded,
  RoutesPageRequested,
  RoutesPageToggleLoading,
  RoutesStatusUpdated,
  RouteUpdated,
  ManyRoutesDeleted,
  OneRouteDeleted
} from '../_actions/route.actions';

@Injectable()
export class RouteEffects {
  showPageLoadingDistpatcher = new RoutesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new RouteActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new RouteActionToggleLoading({isLoading: false});

  @Effect()
  loadRoutesPage$ = this.actions$.pipe(
    ofType<RoutesPageRequested>(RouteActionTypes.RoutesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.routesService.findRoutes(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new RoutesPageLoaded({
        routes: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteRoute$ = this.actions$
    .pipe(
      ofType<OneRouteDeleted>(RouteActionTypes.OneRouteDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.routesService.deleteRoute(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteRoutes$ = this.actions$
    .pipe(
      ofType<ManyRoutesDeleted>(RouteActionTypes.ManyRoutesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.routesService.deleteRoutes(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateRoute$ = this.actions$
    .pipe(
      ofType<RouteUpdated>(RouteActionTypes.RouteUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.routesService.updateRoute(payload.route);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateRoutesStatus$ = this.actions$
    .pipe(
      ofType<RoutesStatusUpdated>(RouteActionTypes.RoutesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.routesService.updateStatusForRoute(payload.routes, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createRoute$ = this.actions$
    .pipe(
      ofType<RouteOnServerCreated>(RouteActionTypes.RouteOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.routesService.createRoute(payload.route).pipe(
          tap(res => {
            this.store.dispatch(new RouteCreated({route: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private routesService: RouteService, private store: Store<AppState>) {
  }
}
