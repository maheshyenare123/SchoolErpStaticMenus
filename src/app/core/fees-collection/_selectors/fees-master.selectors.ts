// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { FeesMastersState } from '../_reducers/fees-master.reducers';
import { FeesMasterModel } from '../_models/fees-master.model';

export const selectFeesMastersState = createFeatureSelector<FeesMastersState>('feesMasters');

export const selectFeesMasterById = (feesMasterId: number) => createSelector(
    selectFeesMastersState,
    feesMastersState => feesMastersState.entities[feesMasterId]
);

export const selectFeesMastersPageLoading = createSelector(
    selectFeesMastersState,
    feesMastersState => feesMastersState.listLoading
);

export const selectFeesMastersActionLoading = createSelector(
    selectFeesMastersState,
    feesMastersState => feesMastersState.actionsloading
);

export const selectLastCreatedFeesMasterId = createSelector(
    selectFeesMastersState,
    feesMastersState => feesMastersState.lastCreatedFeesMasterId
);

export const selectFeesMastersShowInitWaitingMessage = createSelector(
    selectFeesMastersState,
    feesMastersState => feesMastersState.showInitWaitingMessage
);

export const selectFeesMastersInStore = createSelector(
    selectFeesMastersState,
    feesMastersState => {
      const items: FeesMasterModel[] = [];
      each(feesMastersState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: FeesMasterModel[] =
        httpExtension.sortArray(items, feesMastersState.lastQuery.sortField, feesMastersState.lastQuery.sortOrder);
      return new QueryResultsModel(result, feesMastersState.totalCount, '');
    }
);
