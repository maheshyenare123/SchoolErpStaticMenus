// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ItemStoresState } from '../_reducers/item-store.reducers';
import { ItemStoreModel } from '../_models/item-store.model';

export const selectItemStoresState = createFeatureSelector<ItemStoresState>('itemStores');

export const selectItemStoreById = (itemStoreId: number) => createSelector(
    selectItemStoresState,
    itemStoresState => itemStoresState.entities[itemStoreId]
);

export const selectItemStoresPageLoading = createSelector(
    selectItemStoresState,
    itemStoresState => itemStoresState.listLoading
);

export const selectItemStoresActionLoading = createSelector(
    selectItemStoresState,
    itemStoresState => itemStoresState.actionsloading
);

export const selectLastCreatedItemStoreId = createSelector(
    selectItemStoresState,
    itemStoresState => itemStoresState.lastCreatedItemStoreId
);

export const selectItemStoresShowInitWaitingMessage = createSelector(
    selectItemStoresState,
    itemStoresState => itemStoresState.showInitWaitingMessage
);

export const selectItemStoresInStore = createSelector(
    selectItemStoresState,
    itemStoresState => {
      const items: ItemStoreModel[] = [];
      each(itemStoresState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ItemStoreModel[] =
        httpExtension.sortArray(items, itemStoresState.lastQuery.sortField, itemStoresState.lastQuery.sortOrder);
      return new QueryResultsModel(result, itemStoresState.totalCount, '');
    }
);
