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
import {BulkDeleteService} from '../_services/bulk-delete.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  BulkDeleteActionToggleLoading,
  BulkDeleteActionTypes,
  BulkDeleteCreated,
  BulkDeleteOnServerCreated,
  BulkDeletesPageLoaded,
  BulkDeletesPageRequested,
  BulkDeletesPageToggleLoading,
  BulkDeletesStatusUpdated,
  BulkDeleteUpdated,
  ManyBulkDeletesDeleted,
  OneBulkDeleteDeleted
} from '../_actions/bulk-delete.actions';

@Injectable()
export class BulkDeleteEffects {
  showPageLoadingDistpatcher = new BulkDeletesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new BulkDeleteActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new BulkDeleteActionToggleLoading({isLoading: false});

  @Effect()
  loadBulkDeletesPage$ = this.actions$.pipe(
    ofType<BulkDeletesPageRequested>(BulkDeleteActionTypes.BulkDeletesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.bulkDeletesService.findBulkDeletes(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data']
      return new BulkDeletesPageLoaded({
        bulkDeletes: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );

  @Effect()
  deleteBulkDelete$ = this.actions$
    .pipe(
      ofType<OneBulkDeleteDeleted>(BulkDeleteActionTypes.OneBulkDeleteDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.bulkDeletesService.deleteBulkDelete(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteBulkDeletes$ = this.actions$
    .pipe(
      ofType<ManyBulkDeletesDeleted>(BulkDeleteActionTypes.ManyBulkDeletesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.bulkDeletesService.deleteBulkDeletes(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateBulkDelete$ = this.actions$
    .pipe(
      ofType<BulkDeleteUpdated>(BulkDeleteActionTypes.BulkDeleteUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.bulkDeletesService.updateBulkDelete(payload.bulkDelete);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateBulkDeletesStatus$ = this.actions$
    .pipe(
      ofType<BulkDeletesStatusUpdated>(BulkDeleteActionTypes.BulkDeletesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.bulkDeletesService.updateStatusForBulkDelete(payload.bulkDeletes, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createBulkDelete$ = this.actions$
    .pipe(
      ofType<BulkDeleteOnServerCreated>(BulkDeleteActionTypes.BulkDeleteOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.bulkDeletesService.createBulkDelete(payload.bulkDelete).pipe(
          tap(res => {
            this.store.dispatch(new BulkDeleteCreated({bulkDelete: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private bulkDeletesService: BulkDeleteService, private store: Store<AppState>) {
  }
}
