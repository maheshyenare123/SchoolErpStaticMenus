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
import {ItemStockService} from '../_services/item-stock.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ItemStockActionToggleLoading,
  ItemStockActionTypes,
  ItemStockCreated,
  ItemStockOnServerCreated,
  ItemStocksPageLoaded,
  ItemStocksPageRequested,
  ItemStocksPageToggleLoading,
  ItemStocksStatusUpdated,
  ItemStockUpdated,
  ManyItemStocksDeleted,
  OneItemStockDeleted
} from '../_actions/item-stock.actions';

@Injectable()
export class ItemStockEffects {
  showPageLoadingDistpatcher = new ItemStocksPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ItemStockActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ItemStockActionToggleLoading({isLoading: false});

  @Effect()
  loadItemStocksPage$ = this.actions$.pipe(
    ofType<ItemStocksPageRequested>(ItemStockActionTypes.ItemStocksPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.itemStocksService.findItemStocks(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ItemStocksPageLoaded({
        itemStocks: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteItemStock$ = this.actions$
    .pipe(
      ofType<OneItemStockDeleted>(ItemStockActionTypes.OneItemStockDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.itemStocksService.deleteItemStock(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteItemStocks$ = this.actions$
    .pipe(
      ofType<ManyItemStocksDeleted>(ItemStockActionTypes.ManyItemStocksDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.itemStocksService.deleteItemStocks(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateItemStock$ = this.actions$
    .pipe(
      ofType<ItemStockUpdated>(ItemStockActionTypes.ItemStockUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemStocksService.updateItemStock(payload.itemStock);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateItemStocksStatus$ = this.actions$
    .pipe(
      ofType<ItemStocksStatusUpdated>(ItemStockActionTypes.ItemStocksStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemStocksService.updateStatusForItemStock(payload.itemStocks, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createItemStock$ = this.actions$
    .pipe(
      ofType<ItemStockOnServerCreated>(ItemStockActionTypes.ItemStockOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemStocksService.createItemStock(payload.itemStock).pipe(
          tap(res => {
            this.store.dispatch(new ItemStockCreated({itemStock: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private itemStocksService: ItemStockService, private store: Store<AppState>) {
  }
}
