// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { PostalReceivesState } from '../_reducers/postal-receive.reducers';
import { DispatchReceiveModel } from '../_models/dispose-dispatch-receive.model';

export const selectPostalReceivesState = createFeatureSelector<PostalReceivesState>('postalReceives');

export const selectPostalReceiveById = (postalReceiveId: number) => createSelector(
    selectPostalReceivesState,
    postalReceivesState => postalReceivesState.entities[postalReceiveId]
);

export const selectPostalReceivesPageLoading = createSelector(
    selectPostalReceivesState,
    postalReceivesState => postalReceivesState.listLoading
);

export const selectPostalReceivesActionLoading = createSelector(
    selectPostalReceivesState,
    postalReceivesState => postalReceivesState.actionsloading
);

export const selectLastCreatedPostalReceiveId = createSelector(
    selectPostalReceivesState,
    postalReceivesState => postalReceivesState.lastCreatedPostalReceiveId
);

export const selectPostalReceivesShowInitWaitingMessage = createSelector(
    selectPostalReceivesState,
    postalReceivesState => postalReceivesState.showInitWaitingMessage
);

export const selectPostalReceivesInStore = createSelector(
    selectPostalReceivesState,
    postalReceivesState => {
      const items: DispatchReceiveModel[] = [];
      each(postalReceivesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: DispatchReceiveModel[] =
        httpExtension.sortArray(items, postalReceivesState.lastQuery.sortField, postalReceivesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, postalReceivesState.totalCount, '');
    }
);
