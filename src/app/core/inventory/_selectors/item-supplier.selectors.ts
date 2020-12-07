// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ItemSuppliersState } from '../_reducers/item-supplier.reducers';
import { ItemSupplierModel } from '../_models/item-supplier.model';

export const selectItemSuppliersState = createFeatureSelector<ItemSuppliersState>('itemSuppliers');

export const selectItemSupplierById = (itemSupplierId: number) => createSelector(
    selectItemSuppliersState,
    itemSuppliersState => itemSuppliersState.entities[itemSupplierId]
);

export const selectItemSuppliersPageLoading = createSelector(
    selectItemSuppliersState,
    itemSuppliersState => itemSuppliersState.listLoading
);

export const selectItemSuppliersActionLoading = createSelector(
    selectItemSuppliersState,
    itemSuppliersState => itemSuppliersState.actionsloading
);

export const selectLastCreatedItemSupplierId = createSelector(
    selectItemSuppliersState,
    itemSuppliersState => itemSuppliersState.lastCreatedItemSupplierId
);

export const selectItemSuppliersShowInitWaitingMessage = createSelector(
    selectItemSuppliersState,
    itemSuppliersState => itemSuppliersState.showInitWaitingMessage
);

export const selectItemSuppliersInStore = createSelector(
    selectItemSuppliersState,
    itemSuppliersState => {
      const items: ItemSupplierModel[] = [];
      each(itemSuppliersState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ItemSupplierModel[] =
        httpExtension.sortArray(items, itemSuppliersState.lastQuery.sortField, itemSuppliersState.lastQuery.sortOrder);
      return new QueryResultsModel(result, itemSuppliersState.totalCount, '');
    }
);
