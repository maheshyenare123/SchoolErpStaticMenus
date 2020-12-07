// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { IncomeModel } from '../_models/income.model';

export enum IncomeActionTypes {
  IncomeOnServerCreated = '[Edit Income Dialog] Income On Server Created',
  IncomeCreated = '[Edit Income Dialog] Income Created',
  IncomeUpdated = '[Edit Income Dialog] Income Updated',
  IncomesStatusUpdated = '[Income List Page] Incomes Status Updated',
  OneIncomeDeleted = '[Incomes List Page] One Income Deleted',
  ManyIncomesDeleted = '[Incomes List Page] Many Income Deleted',
  IncomesPageRequested = '[Incomes List Page] Incomes Page Requested',
  IncomesPageLoaded = '[Incomes API] Incomes Page Loaded',
  IncomesPageCancelled = '[Incomes API] Incomes Page Cancelled',
  IncomesPageToggleLoading = '[Incomes] Incomes Page Toggle Loading',
  IncomeActionToggleLoading = '[Incomes] Incomes Action Toggle Loading'
}

export class IncomeOnServerCreated implements Action {
  readonly type = IncomeActionTypes.IncomeOnServerCreated;
  constructor(public payload: { income: IncomeModel }) {
  }
}

export class IncomeCreated implements Action {
  readonly type = IncomeActionTypes.IncomeCreated;

  constructor(public payload: { income: IncomeModel }) {
  }
}

export class IncomeUpdated implements Action {
  readonly type = IncomeActionTypes.IncomeUpdated;

  constructor(public payload: {
    partialIncome: Update<IncomeModel>, // For State update
    income: IncomeModel // For Server update (through service)
  }) {
  }
}

export class IncomesStatusUpdated implements Action {
  readonly type = IncomeActionTypes.IncomesStatusUpdated;

  constructor(public payload: {
    incomes: IncomeModel[],
    status: number
  }) {
  }
}

export class OneIncomeDeleted implements Action {
  readonly type = IncomeActionTypes.OneIncomeDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyIncomesDeleted implements Action {
  readonly type = IncomeActionTypes.ManyIncomesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class IncomesPageRequested implements Action {
  readonly type = IncomeActionTypes.IncomesPageRequested;

  constructor(public payload: { page: QueryParamsModel,searchTerm:any }) {
  }
}

export class IncomesPageLoaded implements Action {
  readonly type = IncomeActionTypes.IncomesPageLoaded;

  constructor(public payload: { incomes: IncomeModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class IncomesPageCancelled implements Action {
  readonly type = IncomeActionTypes.IncomesPageCancelled;
}

export class IncomesPageToggleLoading implements Action {
  readonly type = IncomeActionTypes.IncomesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class IncomeActionToggleLoading implements Action {
  readonly type = IncomeActionTypes.IncomeActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type IncomeActions = IncomeOnServerCreated
| IncomeCreated
| IncomeUpdated
| IncomesStatusUpdated
| OneIncomeDeleted
| ManyIncomesDeleted
| IncomesPageRequested
| IncomesPageLoaded
| IncomesPageCancelled
| IncomesPageToggleLoading
| IncomeActionToggleLoading;
