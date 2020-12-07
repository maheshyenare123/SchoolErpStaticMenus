// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StaffLeaveRequestsState } from '../_reducers/staff-leave-request.reducers';
import { StaffLeaveRequestModel } from '../_models/staff-leave-request.model';

export const selectStaffLeaveRequestsState = createFeatureSelector<StaffLeaveRequestsState>('staffLeaveRequests');

export const selectStaffLeaveRequestById = (staffLeaveRequestId: number) => createSelector(
    selectStaffLeaveRequestsState,
    staffLeaveRequestsState => staffLeaveRequestsState.entities[staffLeaveRequestId]
);

export const selectStaffLeaveRequestsPageLoading = createSelector(
    selectStaffLeaveRequestsState,
    staffLeaveRequestsState => staffLeaveRequestsState.listLoading
);

export const selectStaffLeaveRequestsActionLoading = createSelector(
    selectStaffLeaveRequestsState,
    staffLeaveRequestsState => staffLeaveRequestsState.actionsloading
);

export const selectLastCreatedStaffLeaveRequestId = createSelector(
    selectStaffLeaveRequestsState,
    staffLeaveRequestsState => staffLeaveRequestsState.lastCreatedStaffLeaveRequestId
);

export const selectStaffLeaveRequestsShowInitWaitingMessage = createSelector(
    selectStaffLeaveRequestsState,
    staffLeaveRequestsState => staffLeaveRequestsState.showInitWaitingMessage
);

export const selectStaffLeaveRequestsInStore = createSelector(
    selectStaffLeaveRequestsState,
    staffLeaveRequestsState => {
      const items: StaffLeaveRequestModel[] = [];
      each(staffLeaveRequestsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StaffLeaveRequestModel[] =
        httpExtension.sortArray(items, staffLeaveRequestsState.lastQuery.sortField, staffLeaveRequestsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, staffLeaveRequestsState.totalCount, '');
    }
);
