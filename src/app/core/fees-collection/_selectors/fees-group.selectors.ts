// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { FeesGroupsState } from '../_reducers/fees-group.reducers';
import { FeesGroupModel } from '../_models/fees-group.model';

export const selectFeesGroupsState = createFeatureSelector<FeesGroupsState>('feesGroups');

export const selectFeesGroupById = (feesGroupId: number) => createSelector(
    selectFeesGroupsState,
    feesGroupsState => feesGroupsState.entities[feesGroupId]
);

export const selectFeesGroupsPageLoading = createSelector(
    selectFeesGroupsState,
    feesGroupsState => feesGroupsState.listLoading
);

export const selectFeesGroupsActionLoading = createSelector(
    selectFeesGroupsState,
    feesGroupsState => feesGroupsState.actionsloading
);

export const selectLastCreatedFeesGroupId = createSelector(
    selectFeesGroupsState,
    feesGroupsState => feesGroupsState.lastCreatedFeesGroupId
);

export const selectFeesGroupsShowInitWaitingMessage = createSelector(
    selectFeesGroupsState,
    feesGroupsState => feesGroupsState.showInitWaitingMessage
);

export const selectFeesGroupsInStore = createSelector(
    selectFeesGroupsState,
    feesGroupsState => {
      const items: FeesGroupModel[] = [];
      each(feesGroupsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: FeesGroupModel[] =
        httpExtension.sortArray(items, feesGroupsState.lastQuery.sortField, feesGroupsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, feesGroupsState.totalCount, '');
    }
);
