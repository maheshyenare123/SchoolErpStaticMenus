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
import {ItemSupplierService} from '../_services/item-supplier.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ItemSupplierActionToggleLoading,
  ItemSupplierActionTypes,
  ItemSupplierCreated,
  ItemSupplierOnServerCreated,
  ItemSuppliersPageLoaded,
  ItemSuppliersPageRequested,
  ItemSuppliersPageToggleLoading,
  ItemSuppliersStatusUpdated,
  ItemSupplierUpdated,
  ManyItemSuppliersDeleted,
  OneItemSupplierDeleted
} from '../_actions/item-supplier.actions';

@Injectable()
export class ItemSupplierEffects {
  showPageLoadingDistpatcher = new ItemSuppliersPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ItemSupplierActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ItemSupplierActionToggleLoading({isLoading: false});

  @Effect()
  loadItemSuppliersPage$ = this.actions$.pipe(
    ofType<ItemSuppliersPageRequested>(ItemSupplierActionTypes.ItemSuppliersPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.itemSuppliersService.findItemSuppliers(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ItemSuppliersPageLoaded({
        itemSuppliers: data.content,
totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteItemSupplier$ = this.actions$
    .pipe(
      ofType<OneItemSupplierDeleted>(ItemSupplierActionTypes.OneItemSupplierDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.itemSuppliersService.deleteItemSupplier(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteItemSuppliers$ = this.actions$
    .pipe(
      ofType<ManyItemSuppliersDeleted>(ItemSupplierActionTypes.ManyItemSuppliersDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.itemSuppliersService.deleteItemSuppliers(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateItemSupplier$ = this.actions$
    .pipe(
      ofType<ItemSupplierUpdated>(ItemSupplierActionTypes.ItemSupplierUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemSuppliersService.updateItemSupplier(payload.itemSupplier);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateItemSuppliersStatus$ = this.actions$
    .pipe(
      ofType<ItemSuppliersStatusUpdated>(ItemSupplierActionTypes.ItemSuppliersStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemSuppliersService.updateStatusForItemSupplier(payload.itemSuppliers, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createItemSupplier$ = this.actions$
    .pipe(
      ofType<ItemSupplierOnServerCreated>(ItemSupplierActionTypes.ItemSupplierOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemSuppliersService.createItemSupplier(payload.itemSupplier).pipe(
          tap(res => {
            this.store.dispatch(new ItemSupplierCreated({itemSupplier: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private itemSuppliersService: ItemSupplierService, private store: Store<AppState>) {
  }
}
