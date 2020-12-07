// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ExpenseHeadModel } from '../_models/expense-head.model';

export enum ExpenseHeadActionTypes {
  ExpenseHeadOnServerCreated = '[Edit ExpenseHead Dialog] ExpenseHead On Server Created',
  ExpenseHeadCreated = '[Edit ExpenseHead Dialog] ExpenseHead Created',
  ExpenseHeadUpdated = '[Edit ExpenseHead Dialog] ExpenseHead Updated',
  ExpenseHeadsStatusUpdated = '[ExpenseHead List Page] ExpenseHeads Status Updated',
  OneExpenseHeadDeleted = '[ExpenseHeads List Page] One ExpenseHead Deleted',
  ManyExpenseHeadsDeleted = '[ExpenseHeads List Page] Many ExpenseHead Deleted',
  ExpenseHeadsPageRequested = '[ExpenseHeads List Page] ExpenseHeads Page Requested',
  ExpenseHeadsPageLoaded = '[ExpenseHeads API] ExpenseHeads Page Loaded',
  ExpenseHeadsPageCancelled = '[ExpenseHeads API] ExpenseHeads Page Cancelled',
  ExpenseHeadsPageToggleLoading = '[ExpenseHeads] ExpenseHeads Page Toggle Loading',
  ExpenseHeadActionToggleLoading = '[ExpenseHeads] ExpenseHeads Action Toggle Loading'
}

export class ExpenseHeadOnServerCreated implements Action {
  readonly type = ExpenseHeadActionTypes.ExpenseHeadOnServerCreated;
  constructor(public payload: { expenseHead: ExpenseHeadModel }) {
  }
}

export class ExpenseHeadCreated implements Action {
  readonly type = ExpenseHeadActionTypes.ExpenseHeadCreated;

  constructor(public payload: { expenseHead: ExpenseHeadModel }) {
  }
}

export class ExpenseHeadUpdated implements Action {
  readonly type = ExpenseHeadActionTypes.ExpenseHeadUpdated;

  constructor(public payload: {
    partialExpenseHead: Update<ExpenseHeadModel>, // For State update
    expenseHead: ExpenseHeadModel // For Server update (through service)
  }) {
  }
}

export class ExpenseHeadsStatusUpdated implements Action {
  readonly type = ExpenseHeadActionTypes.ExpenseHeadsStatusUpdated;

  constructor(public payload: {
    expenseHeads: ExpenseHeadModel[],
    status: number
  }) {
  }
}

export class OneExpenseHeadDeleted implements Action {
  readonly type = ExpenseHeadActionTypes.OneExpenseHeadDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyExpenseHeadsDeleted implements Action {
  readonly type = ExpenseHeadActionTypes.ManyExpenseHeadsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ExpenseHeadsPageRequested implements Action {
  readonly type = ExpenseHeadActionTypes.ExpenseHeadsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class ExpenseHeadsPageLoaded implements Action {
  readonly type = ExpenseHeadActionTypes.ExpenseHeadsPageLoaded;

  constructor(public payload: { expenseHeads: ExpenseHeadModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ExpenseHeadsPageCancelled implements Action {
  readonly type = ExpenseHeadActionTypes.ExpenseHeadsPageCancelled;
}

export class ExpenseHeadsPageToggleLoading implements Action {
  readonly type = ExpenseHeadActionTypes.ExpenseHeadsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ExpenseHeadActionToggleLoading implements Action {
  readonly type = ExpenseHeadActionTypes.ExpenseHeadActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ExpenseHeadActions = ExpenseHeadOnServerCreated
| ExpenseHeadCreated
| ExpenseHeadUpdated
| ExpenseHeadsStatusUpdated
| OneExpenseHeadDeleted
| ManyExpenseHeadsDeleted
| ExpenseHeadsPageRequested
| ExpenseHeadsPageLoaded
| ExpenseHeadsPageCancelled
| ExpenseHeadsPageToggleLoading
| ExpenseHeadActionToggleLoading;
