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
import {FeesMasterService} from '../_services/fees-master.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  FeesMasterActionToggleLoading,
  FeesMasterActionTypes,
  FeesMasterCreated,
  FeesMasterOnServerCreated,
  FeesMastersPageLoaded,
  FeesMastersPageRequested,
  FeesMastersPageToggleLoading,
  FeesMastersStatusUpdated,
  FeesMasterUpdated,
  ManyFeesMastersDeleted,
  OneFeesMasterDeleted
} from '../_actions/fees-master.actions';

@Injectable()
export class FeesMasterEffects {
  showPageLoadingDistpatcher = new FeesMastersPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new FeesMasterActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new FeesMasterActionToggleLoading({isLoading: false});

  @Effect()
  loadFeesMastersPage$ = this.actions$.pipe(
    ofType<FeesMastersPageRequested>(FeesMasterActionTypes.FeesMastersPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.feesMastersService.findFeesMasters(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new FeesMastersPageLoaded({
        feesMasters: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteFeesMaster$ = this.actions$
    .pipe(
      ofType<OneFeesMasterDeleted>(FeesMasterActionTypes.OneFeesMasterDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.feesMastersService.deleteFeesMaster(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteFeesMasters$ = this.actions$
    .pipe(
      ofType<ManyFeesMastersDeleted>(FeesMasterActionTypes.ManyFeesMastersDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.feesMastersService.deleteFeesMasters(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateFeesMaster$ = this.actions$
    .pipe(
      ofType<FeesMasterUpdated>(FeesMasterActionTypes.FeesMasterUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesMastersService.updateFeesMaster(payload.feesMaster);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateFeesMastersStatus$ = this.actions$
    .pipe(
      ofType<FeesMastersStatusUpdated>(FeesMasterActionTypes.FeesMastersStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesMastersService.updateStatusForFeesMaster(payload.feesMasters, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createFeesMaster$ = this.actions$
    .pipe(
      ofType<FeesMasterOnServerCreated>(FeesMasterActionTypes.FeesMasterOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesMastersService.createFeesMaster(payload.feesMaster).pipe(
          tap(res => {
            this.store.dispatch(new FeesMasterCreated({feesMaster: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private feesMastersService: FeesMasterService, private store: Store<AppState>) {
  }
}
