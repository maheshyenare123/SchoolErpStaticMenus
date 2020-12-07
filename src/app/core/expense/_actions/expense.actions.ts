// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ExpenseModel } from '../_models/expense.model';

export enum ExpenseActionTypes {
  ExpenseOnServerCreated = '[Edit Expense Dialog] Expense On Server Created',
  ExpenseCreated = '[Edit Expense Dialog] Expense Created',
  ExpenseUpdated = '[Edit Expense Dialog] Expense Updated',
  ExpensesStatusUpdated = '[Expense List Page] Expenses Status Updated',
  OneExpenseDeleted = '[Expenses List Page] One Expense Deleted',
  ManyExpensesDeleted = '[Expenses List Page] Many Expense Deleted',
  ExpensesPageRequested = '[Expenses List Page] Expenses Page Requested',
  ExpensesPageLoaded = '[Expenses API] Expenses Page Loaded',
  ExpensesPageCancelled = '[Expenses API] Expenses Page Cancelled',
  ExpensesPageToggleLoading = '[Expenses] Expenses Page Toggle Loading',
  ExpenseActionToggleLoading = '[Expenses] Expenses Action Toggle Loading'
}

export class ExpenseOnServerCreated implements Action {
  readonly type = ExpenseActionTypes.ExpenseOnServerCreated;
  constructor(public payload: { expense: ExpenseModel }) {
  }
}

export class ExpenseCreated implements Action {
  readonly type = ExpenseActionTypes.ExpenseCreated;

  constructor(public payload: { expense: ExpenseModel }) {
  }
}

export class ExpenseUpdated implements Action {
  readonly type = ExpenseActionTypes.ExpenseUpdated;

  constructor(public payload: {
    partialExpense: Update<ExpenseModel>, // For State update
    expense: ExpenseModel // For Server update (through service)
  }) {
  }
}

export class ExpensesStatusUpdated implements Action {
  readonly type = ExpenseActionTypes.ExpensesStatusUpdated;

  constructor(public payload: {
    expenses: ExpenseModel[],
    status: number
  }) {
  }
}

export class OneExpenseDeleted implements Action {
  readonly type = ExpenseActionTypes.OneExpenseDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyExpensesDeleted implements Action {
  readonly type = ExpenseActionTypes.ManyExpensesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ExpensesPageRequested implements Action {
  readonly type = ExpenseActionTypes.ExpensesPageRequested;

  constructor(public payload: { page: QueryParamsModel,searchTerm:any }) {
  }
}

export class ExpensesPageLoaded implements Action {
  readonly type = ExpenseActionTypes.ExpensesPageLoaded;

  constructor(public payload: { expenses: ExpenseModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ExpensesPageCancelled implements Action {
  readonly type = ExpenseActionTypes.ExpensesPageCancelled;
}

export class ExpensesPageToggleLoading implements Action {
  readonly type = ExpenseActionTypes.ExpensesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ExpenseActionToggleLoading implements Action {
  readonly type = ExpenseActionTypes.ExpenseActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ExpenseActions = ExpenseOnServerCreated
| ExpenseCreated
| ExpenseUpdated
| ExpensesStatusUpdated
| OneExpenseDeleted
| ManyExpensesDeleted
| ExpensesPageRequested
| ExpensesPageLoaded
| ExpensesPageCancelled
| ExpensesPageToggleLoading
| ExpenseActionToggleLoading;
