// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ItemIssuesState } from '../_reducers/item-issue.reducers';
import { ItemIssueModel } from '../_models/item-issue.model';

export const selectItemIssuesState = createFeatureSelector<ItemIssuesState>('itemIssues');

export const selectItemIssueById = (itemIssueId: number) => createSelector(
    selectItemIssuesState,
    itemIssuesState => itemIssuesState.entities[itemIssueId]
);

export const selectItemIssuesPageLoading = createSelector(
    selectItemIssuesState,
    itemIssuesState => itemIssuesState.listLoading
);

export const selectItemIssuesActionLoading = createSelector(
    selectItemIssuesState,
    itemIssuesState => itemIssuesState.actionsloading
);

export const selectLastCreatedItemIssueId = createSelector(
    selectItemIssuesState,
    itemIssuesState => itemIssuesState.lastCreatedItemIssueId
);

export const selectItemIssuesShowInitWaitingMessage = createSelector(
    selectItemIssuesState,
    itemIssuesState => itemIssuesState.showInitWaitingMessage
);

export const selectItemIssuesInStore = createSelector(
    selectItemIssuesState,
    itemIssuesState => {
      const items: ItemIssueModel[] = [];
      each(itemIssuesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ItemIssueModel[] =
        httpExtension.sortArray(items, itemIssuesState.lastQuery.sortField, itemIssuesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, itemIssuesState.totalCount, '');
    }
);
