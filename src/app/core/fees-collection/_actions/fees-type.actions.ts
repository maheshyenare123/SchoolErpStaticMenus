// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { FeesTypeModel } from '../_models/fees-type.model';

export enum FeesTypeActionTypes {
  FeesTypeOnServerCreated = '[Edit FeesType Dialog] FeesType On Server Created',
  FeesTypeCreated = '[Edit FeesType Dialog] FeesType Created',
  FeesTypeUpdated = '[Edit FeesType Dialog] FeesType Updated',
  FeesTypesStatusUpdated = '[FeesType List Page] FeesTypes Status Updated',
  OneFeesTypeDeleted = '[FeesTypes List Page] One FeesType Deleted',
  ManyFeesTypesDeleted = '[FeesTypes List Page] Many FeesType Deleted',
  FeesTypesPageRequested = '[FeesTypes List Page] FeesTypes Page Requested',
  FeesTypesPageLoaded = '[FeesTypes API] FeesTypes Page Loaded',
  FeesTypesPageCancelled = '[FeesTypes API] FeesTypes Page Cancelled',
  FeesTypesPageToggleLoading = '[FeesTypes] FeesTypes Page Toggle Loading',
  FeesTypeActionToggleLoading = '[FeesTypes] FeesTypes Action Toggle Loading'
}

export class FeesTypeOnServerCreated implements Action {
  readonly type = FeesTypeActionTypes.FeesTypeOnServerCreated;
  constructor(public payload: { feesType: FeesTypeModel }) {
  }
}

export class FeesTypeCreated implements Action {
  readonly type = FeesTypeActionTypes.FeesTypeCreated;

  constructor(public payload: { feesType: FeesTypeModel }) {
  }
}

export class FeesTypeUpdated implements Action {
  readonly type = FeesTypeActionTypes.FeesTypeUpdated;

  constructor(public payload: {
    partialFeesType: Update<FeesTypeModel>, // For State update
    feesType: FeesTypeModel // For Server update (through service)
  }) {
  }
}

export class FeesTypesStatusUpdated implements Action {
  readonly type = FeesTypeActionTypes.FeesTypesStatusUpdated;

  constructor(public payload: {
    feesTypes: FeesTypeModel[],
    status: number
  }) {
  }
}

export class OneFeesTypeDeleted implements Action {
  readonly type = FeesTypeActionTypes.OneFeesTypeDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyFeesTypesDeleted implements Action {
  readonly type = FeesTypeActionTypes.ManyFeesTypesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class FeesTypesPageRequested implements Action {
  readonly type = FeesTypeActionTypes.FeesTypesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class FeesTypesPageLoaded implements Action {
  readonly type = FeesTypeActionTypes.FeesTypesPageLoaded;

  constructor(public payload: { feesTypes: FeesTypeModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class FeesTypesPageCancelled implements Action {
  readonly type = FeesTypeActionTypes.FeesTypesPageCancelled;
}

export class FeesTypesPageToggleLoading implements Action {
  readonly type = FeesTypeActionTypes.FeesTypesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class FeesTypeActionToggleLoading implements Action {
  readonly type = FeesTypeActionTypes.FeesTypeActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type FeesTypeActions = FeesTypeOnServerCreated
| FeesTypeCreated
| FeesTypeUpdated
| FeesTypesStatusUpdated
| OneFeesTypeDeleted
| ManyFeesTypesDeleted
| FeesTypesPageRequested
| FeesTypesPageLoaded
| FeesTypesPageCancelled
| FeesTypesPageToggleLoading
| FeesTypeActionToggleLoading;
