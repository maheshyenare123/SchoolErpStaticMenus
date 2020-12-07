// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { VisitorPurposesState } from '../_reducers/visitor-purpose.reducers';
import { VisitorPurposeModel } from '../_models/visitor-purpose.model';

export const selectVisitorPurposesState = createFeatureSelector<VisitorPurposesState>('visitorPurposes');

export const selectVisitorPurposeById = (visitorPurposeId: number) => createSelector(
    selectVisitorPurposesState,
    visitorPurposesState => visitorPurposesState.entities[visitorPurposeId]
);

export const selectVisitorPurposesPageLoading = createSelector(
    selectVisitorPurposesState,
    visitorPurposesState => visitorPurposesState.listLoading
);

export const selectVisitorPurposesActionLoading = createSelector(
    selectVisitorPurposesState,
    visitorPurposesState => visitorPurposesState.actionsloading
);

export const selectLastCreatedVisitorPurposeId = createSelector(
    selectVisitorPurposesState,
    visitorPurposesState => visitorPurposesState.lastCreatedVisitorPurposeId
);

export const selectVisitorPurposesShowInitWaitingMessage = createSelector(
    selectVisitorPurposesState,
    visitorPurposesState => visitorPurposesState.showInitWaitingMessage
);

export const selectVisitorPurposesInStore = createSelector(
    selectVisitorPurposesState,
    visitorPurposesState => {
      const items: VisitorPurposeModel[] = [];
      each(visitorPurposesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: VisitorPurposeModel[] =
        httpExtension.sortArray(items, visitorPurposesState.lastQuery.sortField, visitorPurposesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, visitorPurposesState.totalCount, '');
    }
);
