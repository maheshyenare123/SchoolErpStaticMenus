// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ApproveLeavesState } from '../_reducers/approve-leave.reducers';
import { ApproveLeaveDtoModel } from '../_models/approve-leave.model';

export const selectApproveLeavesState = createFeatureSelector<ApproveLeavesState>('approveLeaves');

export const selectApproveLeaveById = (approveLeaveId: number) => createSelector(
    selectApproveLeavesState,
    approveLeavesState => approveLeavesState.entities[approveLeaveId]
);

export const selectApproveLeavesPageLoading = createSelector(
    selectApproveLeavesState,
    approveLeavesState => approveLeavesState.listLoading
);

export const selectApproveLeavesActionLoading = createSelector(
    selectApproveLeavesState,
    approveLeavesState => approveLeavesState.actionsloading
);

export const selectLastCreatedApproveLeaveId = createSelector(
    selectApproveLeavesState,
    approveLeavesState => approveLeavesState.lastCreatedApproveLeaveId
);

export const selectApproveLeavesShowInitWaitingMessage = createSelector(
    selectApproveLeavesState,
    approveLeavesState => approveLeavesState.showInitWaitingMessage
);

export const selectApproveLeavesInStore = createSelector(
    selectApproveLeavesState,
    approveLeavesState => {
      const items: ApproveLeaveDtoModel[] = [];
      each(approveLeavesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ApproveLeaveDtoModel[] =
        httpExtension.sortArray(items, approveLeavesState.lastQuery.sortField, approveLeavesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, approveLeavesState.totalCount, '');
    }
);
