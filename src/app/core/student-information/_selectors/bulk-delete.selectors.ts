// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { BulkDeletesState } from '../_reducers/bulk-delete.reducers';
import { StudentDtoModel } from '../_models/studentDto.model';

export const selectBulkDeletesState = createFeatureSelector<BulkDeletesState>('bulkDeletes');

export const selectBulkDeleteById = (bulkDeleteId: number) => createSelector(
    selectBulkDeletesState,
    bulkDeletesState => bulkDeletesState.entities[bulkDeleteId]
);

export const selectBulkDeletesPageLoading = createSelector(
    selectBulkDeletesState,
    bulkDeletesState => bulkDeletesState.listLoading
);

export const selectBulkDeletesActionLoading = createSelector(
    selectBulkDeletesState,
    bulkDeletesState => bulkDeletesState.actionsloading
);

export const selectLastCreatedBulkDeleteId = createSelector(
    selectBulkDeletesState,
    bulkDeletesState => bulkDeletesState.lastCreatedBulkDeleteId
);

export const selectBulkDeletesShowInitWaitingMessage = createSelector(
    selectBulkDeletesState,
    bulkDeletesState => bulkDeletesState.showInitWaitingMessage
);

export const selectBulkDeletesInStore = createSelector(
    selectBulkDeletesState,
    bulkDeletesState => {
      const items: StudentDtoModel[] = [];
      each(bulkDeletesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StudentDtoModel[] =
        httpExtension.sortArray(items, bulkDeletesState.lastQuery.sortField, bulkDeletesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, bulkDeletesState.totalCount, '');
    }
);
