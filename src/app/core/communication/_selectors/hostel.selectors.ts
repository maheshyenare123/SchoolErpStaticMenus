// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { HostelsState } from '../_reducers/hostel.reducers';
import { HostelModel } from '../_models/hostel.model';

export const selectHostelsState = createFeatureSelector<HostelsState>('hostels');

export const selectHostelById = (hostelId: number) => createSelector(
    selectHostelsState,
    hostelsState => hostelsState.entities[hostelId]
);

export const selectHostelsPageLoading = createSelector(
    selectHostelsState,
    hostelsState => hostelsState.listLoading
);

export const selectHostelsActionLoading = createSelector(
    selectHostelsState,
    hostelsState => hostelsState.actionsloading
);

export const selectLastCreatedHostelId = createSelector(
    selectHostelsState,
    hostelsState => hostelsState.lastCreatedHostelId
);

export const selectHostelsShowInitWaitingMessage = createSelector(
    selectHostelsState,
    hostelsState => hostelsState.showInitWaitingMessage
);

export const selectHostelsInStore = createSelector(
    selectHostelsState,
    hostelsState => {
      const items: HostelModel[] = [];
      each(hostelsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: HostelModel[] =
        httpExtension.sortArray(items, hostelsState.lastQuery.sortField, hostelsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, hostelsState.totalCount, '');
    }
);
