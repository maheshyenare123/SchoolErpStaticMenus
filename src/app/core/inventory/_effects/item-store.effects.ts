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
import {ItemStoreService} from '../_services/item-store.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ItemStoreActionToggleLoading,
  ItemStoreActionTypes,
  ItemStoreCreated,
  ItemStoreOnServerCreated,
  ItemStoresPageLoaded,
  ItemStoresPageRequested,
  ItemStoresPageToggleLoading,
  ItemStoresStatusUpdated,
  ItemStoreUpdated,
  ManyItemStoresDeleted,
  OneItemStoreDeleted
} from '../_actions/item-store.actions';

@Injectable()
export class ItemStoreEffects {
  showPageLoadingDistpatcher = new ItemStoresPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ItemStoreActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ItemStoreActionToggleLoading({isLoading: false});

  @Effect()
  loadItemStoresPage$ = this.actions$.pipe(
    ofType<ItemStoresPageRequested>(ItemStoreActionTypes.ItemStoresPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.itemStoresService.findItemStores(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ItemStoresPageLoaded({
        itemStores: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteItemStore$ = this.actions$
    .pipe(
      ofType<OneItemStoreDeleted>(ItemStoreActionTypes.OneItemStoreDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.itemStoresService.deleteItemStore(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteItemStores$ = this.actions$
    .pipe(
      ofType<ManyItemStoresDeleted>(ItemStoreActionTypes.ManyItemStoresDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.itemStoresService.deleteItemStores(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateItemStore$ = this.actions$
    .pipe(
      ofType<ItemStoreUpdated>(ItemStoreActionTypes.ItemStoreUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemStoresService.updateItemStore(payload.itemStore);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateItemStoresStatus$ = this.actions$
    .pipe(
      ofType<ItemStoresStatusUpdated>(ItemStoreActionTypes.ItemStoresStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemStoresService.updateStatusForItemStore(payload.itemStores, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createItemStore$ = this.actions$
    .pipe(
      ofType<ItemStoreOnServerCreated>(ItemStoreActionTypes.ItemStoreOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemStoresService.createItemStore(payload.itemStore).pipe(
          tap(res => {
            this.store.dispatch(new ItemStoreCreated({itemStore: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private itemStoresService: ItemStoreService, private store: Store<AppState>) {
  }
}
