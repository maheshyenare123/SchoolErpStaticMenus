// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { IncomeHeadModel } from '../_models/income-head.model';

export enum IncomeHeadActionTypes {
  IncomeHeadOnServerCreated = '[Edit IncomeHead Dialog] IncomeHead On Server Created',
  IncomeHeadCreated = '[Edit IncomeHead Dialog] IncomeHead Created',
  IncomeHeadUpdated = '[Edit IncomeHead Dialog] IncomeHead Updated',
  IncomeHeadsStatusUpdated = '[IncomeHead List Page] IncomeHeads Status Updated',
  OneIncomeHeadDeleted = '[IncomeHeads List Page] One IncomeHead Deleted',
  ManyIncomeHeadsDeleted = '[IncomeHeads List Page] Many IncomeHead Deleted',
  IncomeHeadsPageRequested = '[IncomeHeads List Page] IncomeHeads Page Requested',
  IncomeHeadsPageLoaded = '[IncomeHeads API] IncomeHeads Page Loaded',
  IncomeHeadsPageCancelled = '[IncomeHeads API] IncomeHeads Page Cancelled',
  IncomeHeadsPageToggleLoading = '[IncomeHeads] IncomeHeads Page Toggle Loading',
  IncomeHeadActionToggleLoading = '[IncomeHeads] IncomeHeads Action Toggle Loading'
}

export class IncomeHeadOnServerCreated implements Action {
  readonly type = IncomeHeadActionTypes.IncomeHeadOnServerCreated;
  constructor(public payload: { incomeHead: IncomeHeadModel }) {
  }
}

export class IncomeHeadCreated implements Action {
  readonly type = IncomeHeadActionTypes.IncomeHeadCreated;

  constructor(public payload: { incomeHead: IncomeHeadModel }) {
  }
}

export class IncomeHeadUpdated implements Action {
  readonly type = IncomeHeadActionTypes.IncomeHeadUpdated;

  constructor(public payload: {
    partialIncomeHead: Update<IncomeHeadModel>, // For State update
    incomeHead: IncomeHeadModel // For Server update (through service)
  }) {
  }
}

export class IncomeHeadsStatusUpdated implements Action {
  readonly type = IncomeHeadActionTypes.IncomeHeadsStatusUpdated;

  constructor(public payload: {
    incomeHeads: IncomeHeadModel[],
    status: number
  }) {
  }
}

export class OneIncomeHeadDeleted implements Action {
  readonly type = IncomeHeadActionTypes.OneIncomeHeadDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyIncomeHeadsDeleted implements Action {
  readonly type = IncomeHeadActionTypes.ManyIncomeHeadsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class IncomeHeadsPageRequested implements Action {
  readonly type = IncomeHeadActionTypes.IncomeHeadsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class IncomeHeadsPageLoaded implements Action {
  readonly type = IncomeHeadActionTypes.IncomeHeadsPageLoaded;

  constructor(public payload: { incomeHeads: IncomeHeadModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class IncomeHeadsPageCancelled implements Action {
  readonly type = IncomeHeadActionTypes.IncomeHeadsPageCancelled;
}

export class IncomeHeadsPageToggleLoading implements Action {
  readonly type = IncomeHeadActionTypes.IncomeHeadsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class IncomeHeadActionToggleLoading implements Action {
  readonly type = IncomeHeadActionTypes.IncomeHeadActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type IncomeHeadActions = IncomeHeadOnServerCreated
| IncomeHeadCreated
| IncomeHeadUpdated
| IncomeHeadsStatusUpdated
| OneIncomeHeadDeleted
| ManyIncomeHeadsDeleted
| IncomeHeadsPageRequested
| IncomeHeadsPageLoaded
| IncomeHeadsPageCancelled
| IncomeHeadsPageToggleLoading
| IncomeHeadActionToggleLoading;
