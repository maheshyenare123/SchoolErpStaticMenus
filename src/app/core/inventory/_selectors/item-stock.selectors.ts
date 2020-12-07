// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ItemStocksState } from '../_reducers/item-stock.reducers';
import { ItemStockModel } from '../_models/item-stock.model';

export const selectItemStocksState = createFeatureSelector<ItemStocksState>('itemStocks');

export const selectItemStockById = (itemStockId: number) => createSelector(
    selectItemStocksState,
    itemStocksState => itemStocksState.entities[itemStockId]
);

export const selectItemStocksPageLoading = createSelector(
    selectItemStocksState,
    itemStocksState => itemStocksState.listLoading
);

export const selectItemStocksActionLoading = createSelector(
    selectItemStocksState,
    itemStocksState => itemStocksState.actionsloading
);

export const selectLastCreatedItemStockId = createSelector(
    selectItemStocksState,
    itemStocksState => itemStocksState.lastCreatedItemStockId
);

export const selectItemStocksShowInitWaitingMessage = createSelector(
    selectItemStocksState,
    itemStocksState => itemStocksState.showInitWaitingMessage
);

export const selectItemStocksInStore = createSelector(
    selectItemStocksState,
    itemStocksState => {
      const items: ItemStockModel[] = [];
      each(itemStocksState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ItemStockModel[] =
        httpExtension.sortArray(items, itemStocksState.lastQuery.sortField, itemStocksState.lastQuery.sortOrder);
      return new QueryResultsModel(result, itemStocksState.totalCount, '');
    }
);
