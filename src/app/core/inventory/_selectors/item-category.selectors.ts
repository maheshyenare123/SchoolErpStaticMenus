// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ItemCategorysState } from '../_reducers/item-category.reducers';
import { ItemCategoryModel } from '../_models/item-category.model';

export const selectItemCategorysState = createFeatureSelector<ItemCategorysState>('itemCategorys');

export const selectItemCategoryById = (itemCategoryId: number) => createSelector(
    selectItemCategorysState,
    itemCategorysState => itemCategorysState.entities[itemCategoryId]
);

export const selectItemCategorysPageLoading = createSelector(
    selectItemCategorysState,
    itemCategorysState => itemCategorysState.listLoading
);

export const selectItemCategorysActionLoading = createSelector(
    selectItemCategorysState,
    itemCategorysState => itemCategorysState.actionsloading
);

export const selectLastCreatedItemCategoryId = createSelector(
    selectItemCategorysState,
    itemCategorysState => itemCategorysState.lastCreatedItemCategoryId
);

export const selectItemCategorysShowInitWaitingMessage = createSelector(
    selectItemCategorysState,
    itemCategorysState => itemCategorysState.showInitWaitingMessage
);

export const selectItemCategorysInStore = createSelector(
    selectItemCategorysState,
    itemCategorysState => {
      const items: ItemCategoryModel[] = [];
      each(itemCategorysState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ItemCategoryModel[] =
        httpExtension.sortArray(items, itemCategorysState.lastQuery.sortField, itemCategorysState.lastQuery.sortOrder);
      return new QueryResultsModel(result, itemCategorysState.totalCount, '');
    }
);
