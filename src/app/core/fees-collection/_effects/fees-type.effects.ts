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
import {FeesTypeService} from '../_services/fees-type.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  FeesTypeActionToggleLoading,
  FeesTypeActionTypes,
  FeesTypeCreated,
  FeesTypeOnServerCreated,
  FeesTypesPageLoaded,
  FeesTypesPageRequested,
  FeesTypesPageToggleLoading,
  FeesTypesStatusUpdated,
  FeesTypeUpdated,
  ManyFeesTypesDeleted,
  OneFeesTypeDeleted
} from '../_actions/fees-type.actions';

@Injectable()
export class FeesTypeEffects {
  showPageLoadingDistpatcher = new FeesTypesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new FeesTypeActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new FeesTypeActionToggleLoading({isLoading: false});

  @Effect()
  loadFeesTypesPage$ = this.actions$.pipe(
    ofType<FeesTypesPageRequested>(FeesTypeActionTypes.FeesTypesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.feesTypesService.findFeesTypes(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new FeesTypesPageLoaded({
        feesTypes: data.content,
    totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteFeesType$ = this.actions$
    .pipe(
      ofType<OneFeesTypeDeleted>(FeesTypeActionTypes.OneFeesTypeDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.feesTypesService.deleteFeesType(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteFeesTypes$ = this.actions$
    .pipe(
      ofType<ManyFeesTypesDeleted>(FeesTypeActionTypes.ManyFeesTypesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.feesTypesService.deleteFeesTypes(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateFeesType$ = this.actions$
    .pipe(
      ofType<FeesTypeUpdated>(FeesTypeActionTypes.FeesTypeUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesTypesService.updateFeesType(payload.feesType);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateFeesTypesStatus$ = this.actions$
    .pipe(
      ofType<FeesTypesStatusUpdated>(FeesTypeActionTypes.FeesTypesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesTypesService.updateStatusForFeesType(payload.feesTypes, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createFeesType$ = this.actions$
    .pipe(
      ofType<FeesTypeOnServerCreated>(FeesTypeActionTypes.FeesTypeOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesTypesService.createFeesType(payload.feesType).pipe(
          tap(res => {
            this.store.dispatch(new FeesTypeCreated({feesType: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private feesTypesService: FeesTypeService, private store: Store<AppState>) {
  }
}
