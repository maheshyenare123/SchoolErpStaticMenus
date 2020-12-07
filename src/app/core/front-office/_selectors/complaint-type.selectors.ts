// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ComplaintTypesState } from '../_reducers/complaint-type.reducers';
import { ComplaintTypeModel } from '../_models/complaint-type.model';

export const selectComplaintTypesState = createFeatureSelector<ComplaintTypesState>('complaintTypes');

export const selectComplaintTypeById = (complaintTypeId: number) => createSelector(
    selectComplaintTypesState,
    complaintTypesState => complaintTypesState.entities[complaintTypeId]
);

export const selectComplaintTypesPageLoading = createSelector(
    selectComplaintTypesState,
    complaintTypesState => complaintTypesState.listLoading
);

export const selectComplaintTypesActionLoading = createSelector(
    selectComplaintTypesState,
    complaintTypesState => complaintTypesState.actionsloading
);

export const selectLastCreatedComplaintTypeId = createSelector(
    selectComplaintTypesState,
    complaintTypesState => complaintTypesState.lastCreatedComplaintTypeId
);

export const selectComplaintTypesShowInitWaitingMessage = createSelector(
    selectComplaintTypesState,
    complaintTypesState => complaintTypesState.showInitWaitingMessage
);

export const selectComplaintTypesInStore = createSelector(
    selectComplaintTypesState,
    complaintTypesState => {
      const items: ComplaintTypeModel[] = [];
      each(complaintTypesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ComplaintTypeModel[] =
        httpExtension.sortArray(items, complaintTypesState.lastQuery.sortField, complaintTypesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, complaintTypesState.totalCount, '');
    }
);
