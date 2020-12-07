// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ExpenseHeadsState } from '../_reducers/expense-head.reducers';
import { ExpenseHeadModel } from '../_models/expense-head.model';

export const selectExpenseHeadsState = createFeatureSelector<ExpenseHeadsState>('expenseHeads');

export const selectExpenseHeadById = (expenseHeadId: number) => createSelector(
    selectExpenseHeadsState,
    expenseHeadsState => expenseHeadsState.entities[expenseHeadId]
);

export const selectExpenseHeadsPageLoading = createSelector(
    selectExpenseHeadsState,
    expenseHeadsState => expenseHeadsState.listLoading
);

export const selectExpenseHeadsActionLoading = createSelector(
    selectExpenseHeadsState,
    expenseHeadsState => expenseHeadsState.actionsloading
);

export const selectLastCreatedExpenseHeadId = createSelector(
    selectExpenseHeadsState,
    expenseHeadsState => expenseHeadsState.lastCreatedExpenseHeadId
);

export const selectExpenseHeadsShowInitWaitingMessage = createSelector(
    selectExpenseHeadsState,
    expenseHeadsState => expenseHeadsState.showInitWaitingMessage
);

export const selectExpenseHeadsInStore = createSelector(
    selectExpenseHeadsState,
    expenseHeadsState => {
      const items: ExpenseHeadModel[] = [];
      each(expenseHeadsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ExpenseHeadModel[] =
        httpExtension.sortArray(items, expenseHeadsState.lastQuery.sortField, expenseHeadsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, expenseHeadsState.totalCount, '');
    }
);
