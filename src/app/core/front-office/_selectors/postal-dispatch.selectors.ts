// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { PostalDispatchsState } from '../_reducers/postal-dispatch.reducers';
import { DispatchReceiveModel } from '../_models/dispose-dispatch-receive.model';

export const selectPostalDispatchsState = createFeatureSelector<PostalDispatchsState>('postalDispatchs');

export const selectPostalDispatchById = (postalDispatchId: number) => createSelector(
    selectPostalDispatchsState,
    postalDispatchsState => postalDispatchsState.entities[postalDispatchId]
);

export const selectPostalDispatchsPageLoading = createSelector(
    selectPostalDispatchsState,
    postalDispatchsState => postalDispatchsState.listLoading
);

export const selectPostalDispatchsActionLoading = createSelector(
    selectPostalDispatchsState,
    postalDispatchsState => postalDispatchsState.actionsloading
);

export const selectLastCreatedPostalDispatchId = createSelector(
    selectPostalDispatchsState,
    postalDispatchsState => postalDispatchsState.lastCreatedPostalDispatchId
);

export const selectPostalDispatchsShowInitWaitingMessage = createSelector(
    selectPostalDispatchsState,
    postalDispatchsState => postalDispatchsState.showInitWaitingMessage
);

export const selectPostalDispatchsInStore = createSelector(
    selectPostalDispatchsState,
    postalDispatchsState => {
      const items: DispatchReceiveModel[] = [];
      each(postalDispatchsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: DispatchReceiveModel[] =
        httpExtension.sortArray(items, postalDispatchsState.lastQuery.sortField, postalDispatchsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, postalDispatchsState.totalCount, '');
    }
);
