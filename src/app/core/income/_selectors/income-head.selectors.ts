// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { IncomeHeadsState } from '../_reducers/income-head.reducers';
import { IncomeHeadModel } from '../_models/income-head.model';

export const selectIncomeHeadsState = createFeatureSelector<IncomeHeadsState>('incomeHeads');

export const selectIncomeHeadById = (incomeHeadId: number) => createSelector(
    selectIncomeHeadsState,
    incomeHeadsState => incomeHeadsState.entities[incomeHeadId]
);

export const selectIncomeHeadsPageLoading = createSelector(
    selectIncomeHeadsState,
    incomeHeadsState => incomeHeadsState.listLoading
);

export const selectIncomeHeadsActionLoading = createSelector(
    selectIncomeHeadsState,
    incomeHeadsState => incomeHeadsState.actionsloading
);

export const selectLastCreatedIncomeHeadId = createSelector(
    selectIncomeHeadsState,
    incomeHeadsState => incomeHeadsState.lastCreatedIncomeHeadId
);

export const selectIncomeHeadsShowInitWaitingMessage = createSelector(
    selectIncomeHeadsState,
    incomeHeadsState => incomeHeadsState.showInitWaitingMessage
);

export const selectIncomeHeadsInStore = createSelector(
    selectIncomeHeadsState,
    incomeHeadsState => {
      const items: IncomeHeadModel[] = [];
      each(incomeHeadsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: IncomeHeadModel[] =
        httpExtension.sortArray(items, incomeHeadsState.lastQuery.sortField, incomeHeadsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, incomeHeadsState.totalCount, '');
    }
);
