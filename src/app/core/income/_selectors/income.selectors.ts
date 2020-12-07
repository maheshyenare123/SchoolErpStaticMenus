// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { IncomesState } from '../_reducers/income.reducers';
import { IncomeModel } from '../_models/income.model';

export const selectIncomesState = createFeatureSelector<IncomesState>('incomes');

export const selectIncomeById = (incomeId: number) => createSelector(
    selectIncomesState,
    incomesState => incomesState.entities[incomeId]
);

export const selectIncomesPageLoading = createSelector(
    selectIncomesState,
    incomesState => incomesState.listLoading
);

export const selectIncomesActionLoading = createSelector(
    selectIncomesState,
    incomesState => incomesState.actionsloading
);

export const selectLastCreatedIncomeId = createSelector(
    selectIncomesState,
    incomesState => incomesState.lastCreatedIncomeId
);

export const selectIncomesShowInitWaitingMessage = createSelector(
    selectIncomesState,
    incomesState => incomesState.showInitWaitingMessage
);

export const selectIncomesInStore = createSelector(
    selectIncomesState,
    incomesState => {
      const items: IncomeModel[] = [];
      each(incomesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: IncomeModel[] =
        httpExtension.sortArray(items, incomesState.lastQuery.sortField, incomesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, incomesState.totalCount, '');
    }
);
