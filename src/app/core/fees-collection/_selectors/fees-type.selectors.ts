// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { FeesTypesState } from '../_reducers/fees-type.reducers';
import { FeesTypeModel } from '../_models/fees-type.model';

export const selectFeesTypesState = createFeatureSelector<FeesTypesState>('feesTypes');

export const selectFeesTypeById = (feesTypeId: number) => createSelector(
    selectFeesTypesState,
    feesTypesState => feesTypesState.entities[feesTypeId]
);

export const selectFeesTypesPageLoading = createSelector(
    selectFeesTypesState,
    feesTypesState => feesTypesState.listLoading
);

export const selectFeesTypesActionLoading = createSelector(
    selectFeesTypesState,
    feesTypesState => feesTypesState.actionsloading
);

export const selectLastCreatedFeesTypeId = createSelector(
    selectFeesTypesState,
    feesTypesState => feesTypesState.lastCreatedFeesTypeId
);

export const selectFeesTypesShowInitWaitingMessage = createSelector(
    selectFeesTypesState,
    feesTypesState => feesTypesState.showInitWaitingMessage
);

export const selectFeesTypesInStore = createSelector(
    selectFeesTypesState,
    feesTypesState => {
      const items: FeesTypeModel[] = [];
      each(feesTypesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: FeesTypeModel[] =
        httpExtension.sortArray(items, feesTypesState.lastQuery.sortField, feesTypesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, feesTypesState.totalCount, '');
    }
);
