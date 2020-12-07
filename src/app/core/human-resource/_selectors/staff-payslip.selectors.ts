// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StaffPayslipsState } from '../_reducers/staff-payslip.reducers';
import { StaffPayslipModel } from '../_models/staff-payslip.model';

export const selectStaffPayslipsState = createFeatureSelector<StaffPayslipsState>('staffPayslips');

export const selectStaffPayslipById = (staffPayslipId: number) => createSelector(
    selectStaffPayslipsState,
    staffPayslipsState => staffPayslipsState.entities[staffPayslipId]
);

export const selectStaffPayslipsPageLoading = createSelector(
    selectStaffPayslipsState,
    staffPayslipsState => staffPayslipsState.listLoading
);

export const selectStaffPayslipsActionLoading = createSelector(
    selectStaffPayslipsState,
    staffPayslipsState => staffPayslipsState.actionsloading
);

export const selectLastCreatedStaffPayslipId = createSelector(
    selectStaffPayslipsState,
    staffPayslipsState => staffPayslipsState.lastCreatedStaffPayslipId
);

export const selectStaffPayslipsShowInitWaitingMessage = createSelector(
    selectStaffPayslipsState,
    staffPayslipsState => staffPayslipsState.showInitWaitingMessage
);

export const selectStaffPayslipsInStore = createSelector(
    selectStaffPayslipsState,
    staffPayslipsState => {
      const items: StaffPayslipModel[] = [];
      each(staffPayslipsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StaffPayslipModel[] =
        httpExtension.sortArray(items, staffPayslipsState.lastQuery.sortField, staffPayslipsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, staffPayslipsState.totalCount, '');
    }
);
