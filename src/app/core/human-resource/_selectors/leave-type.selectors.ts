// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { LeaveTypesState } from '../_reducers/leave-type.reducers';
import { LeaveTypeModel } from '../_models/leave-type.model';

export const selectLeaveTypesState = createFeatureSelector<LeaveTypesState>('leaveTypes');

export const selectLeaveTypeById = (leaveTypeId: number) => createSelector(
    selectLeaveTypesState,
    leaveTypesState => leaveTypesState.entities[leaveTypeId]
);

export const selectLeaveTypesPageLoading = createSelector(
    selectLeaveTypesState,
    leaveTypesState => leaveTypesState.listLoading
);

export const selectLeaveTypesActionLoading = createSelector(
    selectLeaveTypesState,
    leaveTypesState => leaveTypesState.actionsloading
);

export const selectLastCreatedLeaveTypeId = createSelector(
    selectLeaveTypesState,
    leaveTypesState => leaveTypesState.lastCreatedLeaveTypeId
);

export const selectLeaveTypesShowInitWaitingMessage = createSelector(
    selectLeaveTypesState,
    leaveTypesState => leaveTypesState.showInitWaitingMessage
);

export const selectLeaveTypesInStore = createSelector(
    selectLeaveTypesState,
    leaveTypesState => {
      const items: LeaveTypeModel[] = [];
      each(leaveTypesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: LeaveTypeModel[] =
        httpExtension.sortArray(items, leaveTypesState.lastQuery.sortField, leaveTypesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, leaveTypesState.totalCount, '');
    }
);
