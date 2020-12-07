// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { DisableReasonsState } from '../_reducers/disable-reason.reducers';
import { DisableReasonModel } from '../_models/disableReason.model';

export const selectDisableReasonsState = createFeatureSelector<DisableReasonsState>('disableReasons');

export const selectDisableReasonById = (disableReasonId: number) => createSelector(
    selectDisableReasonsState,
    disableReasonsState => disableReasonsState.entities[disableReasonId]
);

export const selectDisableReasonsPageLoading = createSelector(
    selectDisableReasonsState,
    disableReasonsState => disableReasonsState.listLoading
);

export const selectDisableReasonsActionLoading = createSelector(
    selectDisableReasonsState,
    disableReasonsState => disableReasonsState.actionsloading
);

export const selectLastCreatedDisableReasonId = createSelector(
    selectDisableReasonsState,
    disableReasonsState => disableReasonsState.lastCreatedDisableReasonId
);

export const selectDisableReasonsShowInitWaitingMessage = createSelector(
    selectDisableReasonsState,
    disableReasonsState => disableReasonsState.showInitWaitingMessage
);

export const selectDisableReasonsInStore = createSelector(
    selectDisableReasonsState,
    disableReasonsState => {
      const items: DisableReasonModel[] = [];
      each(disableReasonsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: DisableReasonModel[] =
        httpExtension.sortArray(items, disableReasonsState.lastQuery.sortField, disableReasonsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, disableReasonsState.totalCount, '');
    }
);
