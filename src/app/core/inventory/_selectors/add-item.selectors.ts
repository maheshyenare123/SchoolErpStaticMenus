// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { AddItemsState } from '../_reducers/add-item.reducers';
import { AddItemModel } from '../_models/add-item.model';

export const selectAddItemsState = createFeatureSelector<AddItemsState>('addItems');

export const selectAddItemById = (addItemId: number) => createSelector(
    selectAddItemsState,
    addItemsState => addItemsState.entities[addItemId]
);

export const selectAddItemsPageLoading = createSelector(
    selectAddItemsState,
    addItemsState => addItemsState.listLoading
);

export const selectAddItemsActionLoading = createSelector(
    selectAddItemsState,
    addItemsState => addItemsState.actionsloading
);

export const selectLastCreatedAddItemId = createSelector(
    selectAddItemsState,
    addItemsState => addItemsState.lastCreatedAddItemId
);

export const selectAddItemsShowInitWaitingMessage = createSelector(
    selectAddItemsState,
    addItemsState => addItemsState.showInitWaitingMessage
);

export const selectAddItemsInStore = createSelector(
    selectAddItemsState,
    addItemsState => {
      const items: AddItemModel[] = [];
      each(addItemsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: AddItemModel[] =
        httpExtension.sortArray(items, addItemsState.lastQuery.sortField, addItemsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, addItemsState.totalCount, '');
    }
);
