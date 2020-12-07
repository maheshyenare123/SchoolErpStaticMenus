// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { CategorysState } from '../_reducers/student-categories.reducers';
import { CategoryDtoModel } from '../_models/categoryDto.model';

export const selectCategorysState = createFeatureSelector<CategorysState>('categorys');

export const selectCategoryById = (categoryId: number) => createSelector(
    selectCategorysState,
    categorysState => categorysState.entities[categoryId]
);

export const selectCategorysPageLoading = createSelector(
    selectCategorysState,
    categorysState => categorysState.listLoading
);

export const selectCategorysActionLoading = createSelector(
    selectCategorysState,
    categorysState => categorysState.actionsloading
);

export const selectLastCreatedCategoryId = createSelector(
    selectCategorysState,
    categorysState => categorysState.lastCreatedCategoryId
);

export const selectCategorysShowInitWaitingMessage = createSelector(
    selectCategorysState,
    categorysState => categorysState.showInitWaitingMessage
);

export const selectCategorysInStore = createSelector(
    selectCategorysState,
    categorysState => {
      const items: CategoryDtoModel[] = [];
      each(categorysState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: CategoryDtoModel[] =
        httpExtension.sortArray(items, categorysState.lastQuery.sortField, categorysState.lastQuery.sortOrder);
      return new QueryResultsModel(result, categorysState.totalCount, '');
    }
);
