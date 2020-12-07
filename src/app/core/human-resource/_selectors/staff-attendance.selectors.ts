// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StaffAttendancesState } from '../_reducers/staff-attendance.reducers';
import { StaffAttendanceModel } from '../_models/staff-attendance.model';

export const selectStaffAttendancesState = createFeatureSelector<StaffAttendancesState>('staffAttendances');

export const selectStaffAttendanceById = (staffAttendanceId: number) => createSelector(
    selectStaffAttendancesState,
    staffAttendancesState => staffAttendancesState.entities[staffAttendanceId]
);

export const selectStaffAttendancesPageLoading = createSelector(
    selectStaffAttendancesState,
    staffAttendancesState => staffAttendancesState.listLoading
);

export const selectStaffAttendancesActionLoading = createSelector(
    selectStaffAttendancesState,
    staffAttendancesState => staffAttendancesState.actionsloading
);

export const selectLastCreatedStaffAttendanceId = createSelector(
    selectStaffAttendancesState,
    staffAttendancesState => staffAttendancesState.lastCreatedStaffAttendanceId
);

export const selectStaffAttendancesShowInitWaitingMessage = createSelector(
    selectStaffAttendancesState,
    staffAttendancesState => staffAttendancesState.showInitWaitingMessage
);

export const selectStaffAttendancesInStore = createSelector(
    selectStaffAttendancesState,
    staffAttendancesState => {
      const items: StaffAttendanceModel[] = [];
      each(staffAttendancesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StaffAttendanceModel[] =
        httpExtension.sortArray(items, staffAttendancesState.lastQuery.sortField, staffAttendancesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, staffAttendancesState.totalCount, '');
    }
);
