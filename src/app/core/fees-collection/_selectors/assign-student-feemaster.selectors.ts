// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { AssignStudentFeemasterssState } from '../_reducers/assign-student-feemaster.reducers';
import { AssignFeemasterStudentRequestDtoModel } from '../_models/assign-feemaster-student-request-dto.model';

export const selectAssignStudentFeemastersState = createFeatureSelector<AssignStudentFeemasterssState>('assignStudentFeemasters');

export const selectAssignStudentFeemasterById = (assignStudentFeemasterId: number) => createSelector(
    selectAssignStudentFeemastersState,
    assignStudentFeemastersState => assignStudentFeemastersState.entities[assignStudentFeemasterId]
);

export const selectAssignStudentFeemastersPageLoading = createSelector(
    selectAssignStudentFeemastersState,
    assignStudentFeemastersState => assignStudentFeemastersState.listLoading
);

export const selectAssignStudentFeemastersActionLoading = createSelector(
    selectAssignStudentFeemastersState,
    assignStudentFeemastersState => assignStudentFeemastersState.actionsloading
);

export const selectLastCreatedAssignStudentFeemasterId = createSelector(
    selectAssignStudentFeemastersState,
    assignStudentFeemastersState => assignStudentFeemastersState.lastCreatedAssignStudentFeemastersId
);

export const selectAssignStudentFeemastersShowInitWaitingMessage = createSelector(
    selectAssignStudentFeemastersState,
    assignStudentFeemastersState => assignStudentFeemastersState.showInitWaitingMessage
);

export const selectAssignStudentFeemastersInStore = createSelector(
    selectAssignStudentFeemastersState,
    assignStudentFeemastersState => {
      const items: AssignFeemasterStudentRequestDtoModel[] = [];
      each(assignStudentFeemastersState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: AssignFeemasterStudentRequestDtoModel[] =
        httpExtension.sortArray(items, assignStudentFeemastersState.lastQuery.sortField, assignStudentFeemastersState.lastQuery.sortOrder);
      return new QueryResultsModel(result, assignStudentFeemastersState.totalCount, '');
    }
);
