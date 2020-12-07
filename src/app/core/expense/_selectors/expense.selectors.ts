// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ExpensesState } from '../_reducers/expense.reducers';
import { ExpenseModel } from '../_models/expense.model';

export const selectExpensesState = createFeatureSelector<ExpensesState>('expenses');

export const selectExpenseById = (expenseId: number) => createSelector(
    selectExpensesState,
    expensesState => expensesState.entities[expenseId]
);

export const selectExpensesPageLoading = createSelector(
    selectExpensesState,
    expensesState => expensesState.listLoading
);

export const selectExpensesActionLoading = createSelector(
    selectExpensesState,
    expensesState => expensesState.actionsloading
);

export const selectLastCreatedExpenseId = createSelector(
    selectExpensesState,
    expensesState => expensesState.lastCreatedExpenseId
);

export const selectExpensesShowInitWaitingMessage = createSelector(
    selectExpensesState,
    expensesState => expensesState.showInitWaitingMessage
);

export const selectExpensesInStore = createSelector(
    selectExpensesState,
    expensesState => {
      const items: ExpenseModel[] = [];
      each(expensesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ExpenseModel[] =
        httpExtension.sortArray(items, expensesState.lastQuery.sortField, expensesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, expensesState.totalCount, '');
    }
);
