// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StaffsState } from '../_reducers/staff.reducers';
import { StaffModel } from '../_models/staff.model';

export const selectStaffsState = createFeatureSelector<StaffsState>('staffs');

export const selectStaffById = (staffId: number) => createSelector(
    selectStaffsState,
    staffsState => staffsState.entities[staffId]
);

export const selectStaffsPageLoading = createSelector(
    selectStaffsState,
    staffsState => staffsState.listLoading
);

export const selectStaffsActionLoading = createSelector(
    selectStaffsState,
    staffsState => staffsState.actionsloading
);

export const selectLastCreatedStaffId = createSelector(
    selectStaffsState,
    staffsState => staffsState.lastCreatedStaffId
);

export const selectStaffsShowInitWaitingMessage = createSelector(
    selectStaffsState,
    staffsState => staffsState.showInitWaitingMessage
);

export const selectStaffsInStore = createSelector(
    selectStaffsState,
    staffsState => {
      const items: StaffModel[] = [];
      each(staffsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StaffModel[] =
        httpExtension.sortArray(items, staffsState.lastQuery.sortField, staffsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, staffsState.totalCount, '');
    }
);
