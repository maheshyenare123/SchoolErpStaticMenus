// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StaffDesignationsState } from '../_reducers/designation.reducers';
import { StaffDesignationModel } from '../_models/staff-designation.model';

export const selectStaffDesignationsState = createFeatureSelector<StaffDesignationsState>('staffDesignations');

export const selectStaffDesignationById = (staffDesignationId: number) => createSelector(
    selectStaffDesignationsState,
    staffDesignationsState => staffDesignationsState.entities[staffDesignationId]
);

export const selectStaffDesignationsPageLoading = createSelector(
    selectStaffDesignationsState,
    staffDesignationsState => staffDesignationsState.listLoading
);

export const selectStaffDesignationsActionLoading = createSelector(
    selectStaffDesignationsState,
    staffDesignationsState => staffDesignationsState.actionsloading
);

export const selectLastCreatedStaffDesignationId = createSelector(
    selectStaffDesignationsState,
    staffDesignationsState => staffDesignationsState.lastCreatedStaffDesignationId
);

export const selectStaffDesignationsShowInitWaitingMessage = createSelector(
    selectStaffDesignationsState,
    staffDesignationsState => staffDesignationsState.showInitWaitingMessage
);

export const selectStaffDesignationsInStore = createSelector(
    selectStaffDesignationsState,
    staffDesignationsState => {
      const items: StaffDesignationModel[] = [];
      each(staffDesignationsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StaffDesignationModel[] =
        httpExtension.sortArray(items, staffDesignationsState.lastQuery.sortField, staffDesignationsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, staffDesignationsState.totalCount, '');
    }
);
