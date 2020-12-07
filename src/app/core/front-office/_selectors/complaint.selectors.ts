// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ComplaintsState } from '../_reducers/complaint.reducers';
import { ComplaintModel } from '../_models/complaint.model';

export const selectComplaintsState = createFeatureSelector<ComplaintsState>('complaints');

export const selectComplaintById = (ComplaintId: number) => createSelector(
    selectComplaintsState,
    ComplaintsState => ComplaintsState.entities[ComplaintId]
);

export const selectComplaintsPageLoading = createSelector(
    selectComplaintsState,
    ComplaintsState => ComplaintsState.listLoading
);

export const selectComplaintsActionLoading = createSelector(
    selectComplaintsState,
    ComplaintsState => ComplaintsState.actionsloading
);

export const selectLastCreatedComplaintId = createSelector(
    selectComplaintsState,
    ComplaintsState => ComplaintsState.lastCreatedComplaintId
);

export const selectComplaintsShowInitWaitingMessage = createSelector(
    selectComplaintsState,
    ComplaintsState => ComplaintsState.showInitWaitingMessage
);

export const selectComplaintsInStore = createSelector(
    selectComplaintsState,
    ComplaintsState => {
      const items: ComplaintModel[] = [];
      each(ComplaintsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ComplaintModel[] =
        httpExtension.sortArray(items, ComplaintsState.lastQuery.sortField, ComplaintsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, ComplaintsState.totalCount, '');
    }
);
