// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { AssignStudentFeediscountssState } from '../_reducers/assign-student-feediscount.reducers';
import { AssignFeediscountStudentRequestDtoModel } from '../_models/assign-feediscount-student-request-dto.model';

export const selectAssignStudentFeediscountsState = createFeatureSelector<AssignStudentFeediscountssState>('assignStudentFeediscounts');

export const selectAssignStudentFeediscountById = (assignStudentFeediscountId: number) => createSelector(
    selectAssignStudentFeediscountsState,
    assignStudentFeediscountsState => assignStudentFeediscountsState.entities[assignStudentFeediscountId]
);

export const selectAssignStudentFeediscountsPageLoading = createSelector(
    selectAssignStudentFeediscountsState,
    assignStudentFeediscountsState => assignStudentFeediscountsState.listLoading
);

export const selectAssignStudentFeediscountsActionLoading = createSelector(
    selectAssignStudentFeediscountsState,
    assignStudentFeediscountsState => assignStudentFeediscountsState.actionsloading
);

export const selectLastCreatedAssignStudentFeediscountId = createSelector(
    selectAssignStudentFeediscountsState,
    assignStudentFeediscountsState => assignStudentFeediscountsState.lastCreatedAssignStudentFeediscountsId
);

export const selectAssignStudentFeediscountsShowInitWaitingMessage = createSelector(
    selectAssignStudentFeediscountsState,
    assignStudentFeediscountsState => assignStudentFeediscountsState.showInitWaitingMessage
);

export const selectAssignStudentFeediscountsInStore = createSelector(
    selectAssignStudentFeediscountsState,
    assignStudentFeediscountsState => {
      const items: AssignFeediscountStudentRequestDtoModel[] = [];
      each(assignStudentFeediscountsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: AssignFeediscountStudentRequestDtoModel[] =
        httpExtension.sortArray(items, assignStudentFeediscountsState.lastQuery.sortField, assignStudentFeediscountsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, assignStudentFeediscountsState.totalCount, '');
    }
);
