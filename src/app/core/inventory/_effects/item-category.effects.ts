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
import {ItemCategoryService} from '../_services/item-category.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ItemCategoryActionToggleLoading,
  ItemCategoryActionTypes,
  ItemCategoryCreated,
  ItemCategoryOnServerCreated,
  ItemCategorysPageLoaded,
  ItemCategorysPageRequested,
  ItemCategorysPageToggleLoading,
  ItemCategorysStatusUpdated,
  ItemCategoryUpdated,
  ManyItemCategorysDeleted,
  OneItemCategoryDeleted
} from '../_actions/item-category.actions';

@Injectable()
export class ItemCategoryEffects {
  showPageLoadingDistpatcher = new ItemCategorysPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ItemCategoryActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ItemCategoryActionToggleLoading({isLoading: false});

  @Effect()
  loadItemCategorysPage$ = this.actions$.pipe(
    ofType<ItemCategorysPageRequested>(ItemCategoryActionTypes.ItemCategorysPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.itemCategorysService.findItemCategorys(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ItemCategorysPageLoaded({
        itemCategorys: data.content,
totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteItemCategory$ = this.actions$
    .pipe(
      ofType<OneItemCategoryDeleted>(ItemCategoryActionTypes.OneItemCategoryDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.itemCategorysService.deleteItemCategory(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteItemCategorys$ = this.actions$
    .pipe(
      ofType<ManyItemCategorysDeleted>(ItemCategoryActionTypes.ManyItemCategorysDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.itemCategorysService.deleteItemCategorys(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateItemCategory$ = this.actions$
    .pipe(
      ofType<ItemCategoryUpdated>(ItemCategoryActionTypes.ItemCategoryUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemCategorysService.updateItemCategory(payload.itemCategory);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateItemCategorysStatus$ = this.actions$
    .pipe(
      ofType<ItemCategorysStatusUpdated>(ItemCategoryActionTypes.ItemCategorysStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemCategorysService.updateStatusForItemCategory(payload.itemCategorys, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createItemCategory$ = this.actions$
    .pipe(
      ofType<ItemCategoryOnServerCreated>(ItemCategoryActionTypes.ItemCategoryOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemCategorysService.createItemCategory(payload.itemCategory).pipe(
          tap(res => {
            this.store.dispatch(new ItemCategoryCreated({itemCategory: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private itemCategorysService: ItemCategoryService, private store: Store<AppState>) {
  }
}
