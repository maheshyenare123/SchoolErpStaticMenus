// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { OnlineAdmissionsState } from '../_reducers/online-admission.reducers';
import { StudentDtoModel } from '../_models/studentDto.model';

export const selectOnlineAdmissionsState = createFeatureSelector<OnlineAdmissionsState>('onlineAdmissions');

export const selectOnlineAdmissionById = (onlineAdmissionId: number) => createSelector(
    selectOnlineAdmissionsState,
    onlineAdmissionsState => onlineAdmissionsState.entities[onlineAdmissionId]
);

export const selectOnlineAdmissionsPageLoading = createSelector(
    selectOnlineAdmissionsState,
    onlineAdmissionsState => onlineAdmissionsState.listLoading
);

export const selectOnlineAdmissionsActionLoading = createSelector(
    selectOnlineAdmissionsState,
    onlineAdmissionsState => onlineAdmissionsState.actionsloading
);

export const selectLastCreatedOnlineAdmissionId = createSelector(
    selectOnlineAdmissionsState,
    onlineAdmissionsState => onlineAdmissionsState.lastCreatedOnlineAdmissionId
);

export const selectOnlineAdmissionsShowInitWaitingMessage = createSelector(
    selectOnlineAdmissionsState,
    onlineAdmissionsState => onlineAdmissionsState.showInitWaitingMessage
);

export const selectOnlineAdmissionsInStore = createSelector(
    selectOnlineAdmissionsState,
    onlineAdmissionsState => {
      const items: StudentDtoModel[] = [];
      each(onlineAdmissionsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StudentDtoModel[] =
        httpExtension.sortArray(items, onlineAdmissionsState.lastQuery.sortField, onlineAdmissionsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, onlineAdmissionsState.totalCount, '');
    }
);
